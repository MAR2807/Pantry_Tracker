from flask import Flask, request, jsonify
from PIL import Image
import io
import torch
from torchvision import models, transforms
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the model
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
model.eval()

# Define preprocessing
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Mapping of indices to class names (Replace this with actual class names for your use case)
class_names = [
    # Add your class names here
]

@app.route('/process-image', methods=['POST'])
def process_image():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'}), 400
    
    try:
        # Read and preprocess the image
        image = Image.open(io.BytesIO(file.read()))
        input_tensor = preprocess(image)
        input_batch = input_tensor.unsqueeze(0)
        
        # Perform prediction
        with torch.no_grad():
            output = model(input_batch)
        
        # Get the predicted class
        _, predicted = torch.max(output, 1)
        class_index = predicted.item()
        
        # Convert index to class name
        item_name = class_names[class_index] if class_index < len(class_names) else str(class_index)

        return jsonify({'success': True, 'itemName': item_name})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
