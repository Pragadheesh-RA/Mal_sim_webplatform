# ML Integration Directory

Place your Jupyter notebook and Python files here for reference:

## Files to include:
- `malware_detection.ipynb` - Your main Jupyter notebook
- `feature_extraction.py` - Feature extraction logic
- `model_converter.py` - Model conversion utilities
- `preprocessing.py` - Data preprocessing functions

## Integration Steps:

### 1. Convert your Random Forest model to TensorFlow.js:

```python
# In your Jupyter notebook or Python script
import tensorflow as tf
from sklearn.ensemble import RandomForestClassifier
import numpy as np

# After training your Random Forest model
rf_model = RandomForestClassifier(...)
rf_model.fit(X_train, y_train)

# Convert to TensorFlow model
def rf_to_tf(rf_model, input_shape):
    # Create a TensorFlow model that mimics Random Forest
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(100, activation='relu', input_shape=input_shape),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(50, activation='relu'),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    
    # Train to mimic Random Forest predictions
    rf_predictions = rf_model.predict_proba(X_train)[:, 1]
    model.compile(optimizer='adam', loss='binary_crossentropy')
    model.fit(X_train, rf_predictions, epochs=100, verbose=0)
    
    return model

# Convert and save
tf_model = rf_to_tf(rf_model, (5,))
tf_model.save('model_for_conversion')

# Convert to TensorFlow.js
import tensorflowjs as tfjs
tfjs.converters.save_keras_model(tf_model, '../public/models')
```

### 2. Update the ML service to use your model:

```javascript
// In src/services/mlModelService.ts
async loadModel(): Promise<void> {
  try {
    this.model = await tf.loadLayersModel('/models/model.json');
    console.log('Your trained model loaded successfully');
  } catch (error) {
    console.error('Error loading model:', error);
  }
}
```

### 3. Implement your feature extraction:

```javascript
// In src/services/fileAnalysisService.ts
private async extractFeatures(file: File): Promise<MLFeatureInputs> {
  // Implement your actual feature extraction logic here
  // This should match the features used in your Jupyter notebook
  
  const features = {
    svcscan_nservices: /* extract from file */,
    handles_avg_handles_per_proc: /* extract from file */,
    svcscan_shared_process_services: /* extract from file */,
    handles_nevent: /* extract from file */,
    handles_nmutant: /* extract from file */
  };
  
  return features;
}
```