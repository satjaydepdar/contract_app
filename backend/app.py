from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from document_processor import DocumentProcessor
from chat_processor import ChatProcessor
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS with proper origins
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",     # Vite development server
            "http://localhost:4173",     # Vite preview server
            "https://contract-app.azurewebsites.net",  # Your Azure domain
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Initialize processors
document_processor = None
chat_processor = ChatProcessor()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        # Check if file is present in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        
        # Check if file was selected
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Secure the filename and save the file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Initialize document processor for the uploaded file
        global document_processor
        document_processor = DocumentProcessor(filepath)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': filename,
            'filepath': filepath
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Validate request data
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        if 'message' not in data or 'filepath' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        
        message = data['message']
        filepath = data['filepath']
        
        # Validate file exists
        if not os.path.exists(filepath):
            return jsonify({'error': 'Document not found'}), 404
        
        # Initialize document processor if not already initialized
        global document_processor
        if document_processor is None or document_processor.filepath != filepath:
            document_processor = DocumentProcessor(filepath)
        
        # Process the query using both processors
        doc_response = document_processor.process_query(message)
        chat_response = chat_processor.process_message(
            f"Based on the document: {doc_response}\n\nUser question: {message}"
        )
        
        return jsonify({
            'response': chat_response,
            'source': filepath
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({'error': 'File too large'}), 413

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print(f"Upload folder path: {UPLOAD_FOLDER}")
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))