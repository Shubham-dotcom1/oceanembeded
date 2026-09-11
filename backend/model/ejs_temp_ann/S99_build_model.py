import tensorflow as tf
from tensorflow.keras.layers import Input, Conv2D, Dense, Concatenate, Flatten, AveragePooling2D
from tensorflow.keras.models import Model

# EJS-temp-ANN output depths (13 depths)
EJS_NATIVE_DEPTHS = [10, 20, 30, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500]

def build_ejs_temp_ann(
    spatial_input_shape=(25, 25, 2), # e.g. SST, SSH patches
    aux_input_shape=(10,),           # e.g. date info, climatology scalars
    output_dim=13                    # 13 standard depths for EJS-temp-ANN
):
    """
    Builds the EJS-temp-ANN architecture.
    This is a hybrid architecture utilizing CNN for spatial features
    and FC-DNN for auxiliary scalars (climatology/time).
    """
    # 1. Spatial Feature Extraction (CNN)
    spatial_input = Input(shape=spatial_input_shape, name="spatial_input")
    
    x = Conv2D(32, kernel_size=(3, 3), activation='relu', padding='same')(spatial_input)
    x = AveragePooling2D(pool_size=(2, 2))(x)
    x = Conv2D(64, kernel_size=(3, 3), activation='relu', padding='same')(x)
    x = AveragePooling2D(pool_size=(2, 2))(x)
    x = Conv2D(128, kernel_size=(3, 3), activation='relu', padding='same')(x)
    
    spatial_features = Flatten()(x)
    spatial_features = Dense(64, activation='relu')(spatial_features)

    # 2. Auxiliary Inputs
    aux_input = Input(shape=aux_input_shape, name="aux_input")
    y = Dense(32, activation='relu')(aux_input)
    
    # 3. Concatenation & Regression (FC-DNN)
    combined = Concatenate()([spatial_features, y])
    z = Dense(128, activation='relu')(combined)
    z = Dense(64, activation='relu')(z)
    
    # Final output predicting temperature at 13 depth levels
    output = Dense(output_dim, activation='linear', name="temperature_profile")(z)
    
    model = Model(inputs=[spatial_input, aux_input], outputs=output, name="EJS_temp_ANN")
    
    return model

if __name__ == "__main__":
    model = build_ejs_temp_ann()
    model.summary()
