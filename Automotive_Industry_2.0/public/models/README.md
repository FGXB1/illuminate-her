# 3D Car Model

The application expects a GLTF model at:
`public/illuminate-her/2020_honda_nsx_na1_lbworks/scene.gltf`

If this file is missing, the game will fallback to a procedural blocky car.

To use a different model:
1. Place your GLB/GLTF file in the `public` folder.
2. Update the `useGLTF` path in `components/CarModel.tsx`.
