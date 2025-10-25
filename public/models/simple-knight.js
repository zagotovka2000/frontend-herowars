// Временная простая модель рыцаря
import * as THREE from 'three'

export function createKnightModel() {
  const group = new THREE.Group()

  // Тело
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 1.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x4FC3F7 })
  )
  body.position.y = 0.75
  group.add(body)

  // Голова
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xFFCCBC })
  )
  head.position.y = 1.8
  group.add(head)

  // Руки
  const leftArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 1, 6),
    new THREE.MeshStandardMaterial({ color: 0x4FC3F7 })
  )
  leftArm.position.set(-0.8, 0.75, 0)
  group.add(leftArm)

  const rightArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 1, 6),
    new THREE.MeshStandardMaterial({ color: 0x4FC3F7 })
  )
  rightArm.position.set(0.8, 0.75, 0)
  group.add(rightArm)

  // Ноги
  const leftLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 1.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x37474F })
  )
  leftLeg.position.set(-0.3, -0.6, 0)
  group.add(leftLeg)

  const rightLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 1.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x37474F })
  )
  rightLeg.position.set(0.3, -0.6, 0)
  group.add(rightLeg)

  // Меч
  const sword = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 1.5, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x78909C })
  )
  sword.position.set(1, 0.75, 0)
  sword.rotation.z = Math.PI / 4
  group.add(sword)

  return group
}
