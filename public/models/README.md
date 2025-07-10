# ML Model Directory

Place your trained malware detection model files here:

## Required Files:
- `malware_detection_model.json` - TensorFlow.js model architecture
- `malware_detection_weights.bin` - Model weights
- `feature_scaler.json` - Feature normalization parameters
- `model_metadata.json` - Model information and configuration

## Model Conversion:
Convert your Jupyter notebook model using TensorFlow.js converter:

```bash
# Install converter
pip install tensorflowjs

# Convert saved model
tensorflowjs_converter --input_format=tf_saved_model \
                      --output_format=tfjs_graph_model \
                      /path/to/your/saved_model \
                      ./public/models

# Or convert from Keras model
tensorflowjs_converter --input_format=keras \
                      /path/to/your/model.h5 \
                      ./public/models
```

## Feature Scaler Format:
```json
{
  "feature_names": [
    "svcscan.nservices",
    "handles.avg_handles_per_proc",
    "svcscan.shared_process_services", 
    "handles.nevent",
    "handles.nmutant"
  ],
  "scaler_params": {
    "mean": [0.5, 0.6, 0.4, 0.3, 0.2],
    "std": [0.3, 0.25, 0.35, 0.2, 0.15]
  }
}
```