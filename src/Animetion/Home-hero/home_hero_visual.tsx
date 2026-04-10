import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrthographicCamera, OrbitControls } from '@react-three/drei'

function HomeHeroVisual() {
  const [cameraType, setCameraType] = useState("perspective")
  const [zoom, setZoom] = useState(50)
  const [fov, setFov] = useState(50)

  return (
    <>
    <div style={{ height: "631px", width:"1826px", position:"absolute", top: 0, left: 0}}>
      <div style={{ position:"absolute", zIndex: 50, top: 20, left: 60}}>
        <button onClick={() => {
          setCameraType(prev =>
            prev === "perspective" ? "orthographic" : "perspective"
          );
        }}
        >
          {cameraType}
        </button>
        {cameraType === "perspective" &&  
        <div>
          <label htmlFor="fov">FOV</label>
          <input 
          type="range" 
          min="20" 
          max="120" 
          value={fov} 
          onChange={(e) => setFov(Number(e.target.value))}>
          </input>
        </div>
        }

        {cameraType === "orthographic" &&  
        <div>
          <label htmlFor="zoom">Zoom</label>
          <input 
          type="range" 
          min="20" 
          max="120" 
          value={zoom} 
          onChange={(e) => setZoom(Number(e.target.value))}>
          </input>
        </div>
        }
  
      </div>
      <Canvas>
        <color attach="background" args={["gold"]}/>
        {cameraType === "orthographic" && (
          <OrthographicCamera
          position={[3, 4, 4]} 
          makeDefault 
          zoom={zoom} 
          />
        )}
        {cameraType === "perspective" && (
          <PerspectiveCamera 
          position={[3, 4, 4]}
          makeDefault 
          fov={fov} />
        )}
        <mesh position={[0,0,0]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial 
          color="royalblue"
          roughness={0.3}
          metalness={0.3}
          />
        </mesh>

        <mesh position={[3,0,0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
          color="hotpink"
          roughness={0.3}
          metalness={0.3}
          />
        </mesh>

        <mesh position={[-3,0,0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
          color="limegreen"
          roughness={0.3}
          metalness={0.3}
          />
        </mesh>

        <mesh position={[0,3,0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
          color="green"
          roughness={0.3}
          metalness={0.3}
          />
        </mesh>

        <mesh position={[0,-3,0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
          color="orange"
          roughness={0.3}
          metalness={0.3}
          />
        </mesh>

        <mesh position={[0,0,3]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
          color="purple"
          roughness={0.3}
          metalness={0.3}
          />
        </mesh>

        <mesh position={[0,0,-3]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
          color="red"
          roughness={0.3}
          metalness={0.3}
          />
        </mesh>

        <OrbitControls />
        <directionalLight></directionalLight>{/* <directionalLight position={[5, 5, 5]} intensity={1} /> */}
        <ambientLight></ambientLight>{/* <ambientLight intensity={0.5} /> */}
        <pointLight></pointLight>{/* <pointLight position={[-5, -5, -5]} intensity={0.5} /> */}
                                
      </Canvas>
    </div>
    </>
  )
}

export default HomeHeroVisual;
