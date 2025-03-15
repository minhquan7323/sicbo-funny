// Dice.jsx
import React, { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import dice1 from "../assets/dice1.png"
import dice2 from "../assets/dice2.png"
import dice3 from "../assets/dice3.png"
import dice4 from "../assets/dice4.png"
import dice5 from "../assets/dice5.png"
import dice6 from "../assets/dice6.png"

const Dice = ({ position, value, shaking }) => {
    const diceRef = useRef()
    const textures = useTexture([dice1, dice2, dice3, dice4, dice5, dice6])

    useEffect(() => {
        if (shaking) {
            diceRef.current.rotation.x = Math.random() * Math.PI
            diceRef.current.rotation.y = Math.random() * Math.PI
        } else {
            diceRef.current.rotation.set(0, 0, 0)
        }
    }, [shaking])

    useFrame(() => {
        if (shaking) {
            diceRef.current.rotation.x += 0.2
            diceRef.current.rotation.y += 0.2
        }
    })

    return (
        <mesh ref={diceRef} position={position}>
            <boxGeometry args={[1, 1, 1]} />
            {[...Array(6)].map((_, i) => (
                <meshStandardMaterial key={i} attach={`material-${i}`} map={textures[value - 1]} color="white" />
            ))}
        </mesh>
    )
}

export default Dice