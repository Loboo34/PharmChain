from PIL import Image, ImageOps
import io
import numpy as np
from typing import Tuple, List, Optional

def validate_image(image_bytes: bytes) -> Image.Image:
    """Validate and open image file"""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        
        # Check if image is corrupted
        image.verify()
        
        # Reopen after verify (verify closes the file)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode not in ('RGB', 'L'):
            image = image.convert('RGB')
        
        return image
    except Exception as e:
        raise ValueError(f"Invalid image file: {str(e)}")

def resize_image(image: Image.Image, max_size: int = 800) -> Image.Image:
    """Resize image maintaining aspect ratio"""
    ratio = min(max_size / image.width, max_size / image.height)
    if ratio < 1:
        new_size = (int(image.width * ratio), int(image.height * ratio))
        image = image.resize(new_size, Image.Resampling.LANCZOS)
    return image

def extract_image_features(image: Image.Image) -> dict:
    """Extract basic features from image for analysis"""
    # Convert to numpy array
    img_array = np.array(image)
    
    features = {
        "width": image.width,
        "height": image.height,
        "mode": image.mode,
        "aspect_ratio": round(image.width / image.height, 2),
        "file_size_bytes": len(image.tobytes()),
        "color_channels": len(img_array.shape)
    }
    
    # Add color statistics for RGB images
    if image.mode == 'RGB' and len(img_array.shape) == 3:
        for i, channel in enumerate(['R', 'G', 'B']):
            channel_data = img_array[:, :, i]
            features[f"{channel}_mean"] = float(np.mean(channel_data))
            features[f"{channel}_std"] = float(np.std(channel_data))
    
    return features

def preprocess_for_model(image: Image.Image, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """Preprocess image for model input (normalize, resize)"""
    from torchvision import transforms
    
    transform = transforms.Compose([
        transforms.Resize(target_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    tensor = transform(image)
    return tensor.numpy()

def detect_image_quality(image: Image.Image) -> dict:
    """Detect image quality issues"""
    img_array = np.array(image.convert('L'))  # Convert to grayscale
    
    quality = {
        "is_blurry": False,
        "is_dark": False,
        "sharpness_score": 0.0,
        "brightness": 0.0
    }
    
    # Calculate sharpness using Laplacian variance
    from scipy import ndimage
    laplacian = ndimage.laplace(img_array)
    sharpness = np.var(laplacian)
    quality["sharpness_score"] = float(sharpness)
    quality["is_blurry"] = sharpness < 100
    
    # Calculate brightness
    brightness = np.mean(img_array)
    quality["brightness"] = float(brightness)
    quality["is_dark"] = brightness < 50
    
    return quality  