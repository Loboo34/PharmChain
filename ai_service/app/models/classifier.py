import torch
import torchvision.transforms as T
from torchvision.models import resnet50, ResNet50_Weights
from PIL import Image
from pathlib import Path

WEIGHTS_PATH = Path(__file__).parent.parent / "weights" / "classifier.pt"

class PackagingClassifier:
    def __init__(self):
        self.model = resnet50(weights=ResNet50_Weights.DEFAULT)
        self.model.fc = torch.nn.Linear(self.model.fc.in_features, 2)  # genuine / counterfeit
        self.model.eval()
        self.ready = False
        if WEIGHTS_PATH.exists():
            self.model.load_state_dict(torch.load(WEIGHTS_PATH, map_location="cpu"))
            self.ready = True

        self.transform = T.Compose([
            T.Resize((224, 224)),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        self.flags_map = {
            0: ["logo_mismatch", "wrong_font", "color_deviation", "hologram_absent"]
        }

    def predict(self, image: Image.Image) -> dict:
        if not self.ready:
            # Stub: return a cautious result until weights are trained
            return {"genuine": True, "confidence": 0.85, "flags": [], "stub": True}

        tensor = self.transform(image).unsqueeze(0)
        with torch.no_grad():
            logits = self.model(tensor)
            probs = torch.softmax(logits, dim=1)[0]
            genuine_prob = probs[1].item()

        flags = self.flags_map[0] if genuine_prob < 0.75 else []
        return {
            "genuine": genuine_prob >= 0.75,
            "confidence": round(genuine_prob, 4),
            "flags": flags,
        }