
import * as THREE from "three";
import gsap from "gsap";
import audioController from "../../utils/AudioController";

export default class FractalTree {
  constructor() {
    this.group = new THREE.Group();
    this.maxDepth = 5;

    this.branchMaterial = new THREE.MeshLambertMaterial({ color: 0x88cc88 });

    this.branches = []; // Store all branches for animation
    this.createBranch(0, 1, this.group);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.group.add(this.ambientLight);

    this.pointLight = new THREE.PointLight(0xffffff, 2, 100);
    this.pointLight.position.set(0, 5, 10);
    this.group.add(this.pointLight);

    const pointLightHelper = new THREE.PointLightHelper(this.pointLight, 0.5);
    this.group.add(pointLightHelper);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(2, 10, 10);
    this.group.add(this.directionalLight);
  }

  createBranch(depth, length, parent) {
    if (depth > this.maxDepth) return;

    const geometry = new THREE.CylinderGeometry(
      0.02 * (this.maxDepth - depth + 1),
      0.03 * (this.maxDepth - depth + 1),
      length,
      8
    );
    const branch = new THREE.Mesh(geometry, this.branchMaterial);
    branch.position.y = length / 2;
    branch.scale.y = 1;

    const container = new THREE.Object3D();
    container.add(branch);
    parent.add(container);

    this.branches.push(branch); // Store reference

    const angle = Math.PI / 6;
    const scale = 0.75;

    for (let i = 0; i < 2; i++) {
      const child = new THREE.Object3D();
      child.position.y = length;
      child.rotation.z = i === 0 ? angle : -angle;
      container.add(child);
      this.createBranch(depth + 1, length * scale, child);
    }
  }

  update(time, deltaTime) {
    if (!audioController.fdata) return;

    const bass = audioController.fdata.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
    const scale = 1 + bass / 255;

    this.branches.forEach((branch) => {
      gsap.to(branch.scale, {
        y: scale,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    this.pointLight.intensity = 0.5 + bass / 255;
  }
}
