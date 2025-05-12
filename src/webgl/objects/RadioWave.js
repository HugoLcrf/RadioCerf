import * as THREE from "three";
import audioController from "../../utils/AudioController";

export default class RadioWave {
  constructor() {
    this.group = new THREE.Group();

    const segmentCount = 128; // plus fluide
    const positions = new Float32Array(segmentCount * 3);

    for (let i = 0; i < segmentCount; i++) {
      positions[i * 3] = (i / segmentCount) * 40 - 20; // x
      positions[i * 3 + 1] = 0; // y
      positions[i * 3 + 2] = 0; // z
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    this.material = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 2,
    });

    this.line = new THREE.Line(this.geometry, this.material);
    this.group.add(this.line);
  }

  update() {
    if (!audioController.fdata) return;

    const positions = this.geometry.attributes.position.array;

    for (let i = 0; i < 128; i++) {
      const x = positions[i * 3]; // on garde x
      const amplitude = (audioController.fdata[i] / 255 - 0.5) * 2;
      positions[i * 3 + 1] = amplitude * 2; // on modifie juste y (oscillation)
    }

    this.geometry.attributes.position.needsUpdate = true;
  }
}