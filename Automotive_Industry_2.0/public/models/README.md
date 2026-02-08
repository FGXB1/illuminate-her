# 3D Car Model

Place your GLTF/GLB model file here.

The application expects a file named `f1_car.glb`.

If you have a different file name, update `components/CarModel.tsx` accordingly.

The model should be centered at origin and scaled appropriately (approx 5m length).
The car should face +Z or -Z (code rotates it 180 degrees assuming standard orientation).

If the model is missing, the game will fallback to a procedural blocky car.
