import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import './WorkshopExperience.css'

const colors = ['#6d8cff', '#c88b55', '#86a58b', '#c46c5b', '#d3b47b']
const positions = [[-3.2, .2, -1.25], [3.2, .2, -1.25], [-3.35, .2, 1.55], [3.35, .2, 1.55], [0, .2, -2.7]]

function Desk() {
  return <group>
    <mesh receiveShadow position={[0,-.22,0]}><boxGeometry args={[10.8,.38,7.2]}/><meshStandardMaterial color="#29251f" roughness={.78}/></mesh>
    <mesh position={[0,-.42,0]}><boxGeometry args={[10.3,.08,6.7]}/><meshStandardMaterial color="#171715"/></mesh>
    <mesh position={[0,-.005,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[10.5,6.9]}/><meshStandardMaterial color="#39342c" roughness={.9}/></mesh>
  </group>
}
function Notebook({ onOpen }) {
  return <group position={[0,.12,.25]} rotation={[-.08,.04,-.025]} onClick={e=>{e.stopPropagation();onOpen()}}>
    <mesh castShadow><boxGeometry args={[2.65,.16,2.08]}/><meshStandardMaterial color="#8b6847" roughness={.82}/></mesh>
    <mesh position={[0,.09,0]}><boxGeometry args={[2.52,.025,1.98]}/><meshStandardMaterial color="#e7ddc9"/></mesh>
    {[ -.66,-.43,-.2,.03,.26,.49,.72 ].map((z,i)=><mesh key={i} position={[0,.112,z]}><boxGeometry args={[i%2?.95:1.55,.008,.014]}/><meshStandardMaterial color="#b6a58a"/></mesh>)}
    <mesh position={[1.17,.14,.86]} rotation={[0,0,-.12]}><boxGeometry args={[.3,.025,.48]}/><meshStandardMaterial color="#557bff"/></mesh>
  </group>
}
function Artifact({project,index,selected,hovered,onSelect,onHover}) {
  const group=useRef()
  useFrame((_,dt)=>{if(group.current){const lift=selected ? 0.22 : hovered ? 0.12 : 0;group.current.position.y=THREE.MathUtils.damp(group.current.position.y,.2+lift,5,dt)}})
  const color=colors[index]
  return <group ref={group} position={positions[index]} onClick={e=>{e.stopPropagation();onSelect(project)}} onPointerOver={e=>{e.stopPropagation();onHover(project.id)}} onPointerOut={()=>onHover(null)}>
    {index===0 && <><mesh castShadow><boxGeometry args={[1.05,.14,1.35]}/><meshStandardMaterial color="#d8d0bf"/></mesh><mesh position={[0,.09,0]}><boxGeometry args={[.92,.035,1.2]}/><meshStandardMaterial color={color}/></mesh></>}
    {index===1 && <><mesh castShadow><boxGeometry args={[1,.16,1.28]}/><meshStandardMaterial color="#d4c4a7"/></mesh><mesh position={[0,.12,0]}><boxGeometry args={[.78,.04,.85]}/><meshStandardMaterial color={color}/></mesh><mesh position={[0,.16,0]}><boxGeometry args={[.54,.02,.06]}/><meshStandardMaterial color="#f4ead7"/></mesh></>}
    {index===2 && <><mesh castShadow><boxGeometry args={[1.22,.12,.88]}/><meshStandardMaterial color="#26312e"/></mesh>{[-.36,-.12,.12,.36].map(x=><mesh key={x} position={[x,.09,0]}><boxGeometry args={[.055,.05,.58]}/><meshStandardMaterial color={color} metalness={.35}/></mesh>)}<mesh position={[0,.17,0]}><boxGeometry args={[.25,.18,.25]}/><meshStandardMaterial color="#d7d2c3"/></mesh></>}
    {index===3 && <><mesh castShadow rotation={[-Math.PI/2,0,0]}><boxGeometry args={[1.25,1.15,.055]}/><meshStandardMaterial color="#e1d7c3"/></mesh><mesh position={[0,.04,.04]} rotation={[0,0,-.28]}><boxGeometry args={[.05,.02,.78]}/><meshStandardMaterial color={color}/></mesh></>}
    {index===4 && <><mesh castShadow><boxGeometry args={[1.12,.82,.62]}/><meshStandardMaterial color="#554638"/></mesh><mesh position={[0,.04,.33]}><boxGeometry args={[.88,.58,.035]}/><meshStandardMaterial color="#1e2c30" emissive="#223b48" emissiveIntensity={.35}/></mesh></>}
    <mesh position={[0,-.13,0]}><cylinderGeometry args={[.04,.04,.08,12]}/><meshStandardMaterial color={color}/></mesh>
  </group>
}
function CameraRig({selectedIndex,pointer,reduced}) {
  const {camera}=useThree()
  useFrame((_,dt)=>{
    if(reduced) return
    const p=selectedIndex<0?[0,5.7,9.8]:[positions[selectedIndex][0],3.8,5.6]
    const drift=.22
    camera.position.lerp(new THREE.Vector3(p[0]+pointer.x*drift,p[1]-pointer.y*drift,p[2]),1-Math.exp(-dt*2.4))
    camera.lookAt(selectedIndex<0?0:positions[selectedIndex][0]*.42,0,selectedIndex<0?0:-.3)
  })
  return null
}
function Scene({projects,selected,hovered,onSelect,onHover,onNotebook,pointer,reduced}) {
  const index=projects.findIndex(p=>p.id===selected)
  return <>
    <color attach="background" args={['#171817']}/><fog attach="fog" args={['#171817',9,19]}/>
    <ambientLight intensity={.78}/><directionalLight castShadow position={[-4,8,5]} intensity={2.1} color="#ffe2b5"/>
    <pointLight position={[4,4,-3]} intensity={22} distance={10} color="#557bff"/><pointLight position={[-4,3,1]} intensity={14} distance={8} color="#d3a66f"/>
    <Desk/><Notebook onOpen={onNotebook}/>
    {projects.map((p,i)=><Artifact key={p.id} project={p} index={i} selected={selected===p.id} hovered={hovered===p.id} onSelect={onSelect} onHover={onHover}/>)}
    <mesh position={[0,1.6,-3.05]}><boxGeometry args={[2.1,1.18,.1]}/><meshStandardMaterial color="#262a2d" metalness={.35}/></mesh>
    <mesh position={[0,1.6,-2.98]}><boxGeometry args={[1.88,.94,.02]}/><meshStandardMaterial color="#263a48" emissive="#24435a" emissiveIntensity={.3}/></mesh>
    <CameraRig selectedIndex={index} pointer={pointer} reduced={reduced}/>
  </>
}
function Fallback({projects,onSelect,onNotebook}) {
  return <div className="workshop-fallback"><div className="workshop-fallback-copy"><span>THE MAKER'S WORKSHOP</span><h2>THE DESK IS OPEN.</h2><p>This device is showing the accessible index instead of the 3D scene.</p><button onClick={onNotebook}>OPEN NOTEBOOK INDEX ↗</button></div><div className="workshop-fallback-list">{projects.map(p=><button key={p.id} onClick={()=>onSelect(p)}><span>{p.id}</span><strong>{p.name}</strong><i>OPEN FILE ↗</i></button>)}</div></div>
}
export default function WorkshopExperience({projects,onOpenProject}) {
  const [selected,setSelected]=useState(null),[hovered,setHovered]=useState(null),[indexOpen,setIndexOpen]=useState(false)
  const [pointer,setPointer]=useState({x:0,y:0}),[reduced,setReduced]=useState(false)
  const selectedProject=projects.find(p=>p.id===selected)||null
  const shortcuts=useMemo(()=>projects.map(p=>({id:p.id,name:p.name})),[projects])
  useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener?.('change',update);return()=>media.removeEventListener?.('change',update)},[])
  const movePointer=e=>{if(reduced||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();setPointer({x:((e.clientX-r.left)/r.width-.5)*2,y:((e.clientY-r.top)/r.height-.5)*2})}
  const selectProject=p=>{setSelected(p.id);setIndexOpen(false)}
  const openIndex=()=>setIndexOpen(true)
  return <section className="workshop-hero" id="main-content" aria-labelledby="workshop-title" onPointerMove={movePointer} onPointerLeave={()=>setPointer({x:0,y:0})}>
    <div className="workshop-topline"><span>THE MAKER'S NOTEBOOK / VOL. 01</span><span>HYDERABAD, INDIA · 2026</span><span>ENGINEERING / DESIGN / IDEAS</span></div>
    <div className="workshop-intro"><div><span className="workshop-kicker">AN INDEPENDENT MAKER'S WORKSPACE</span><h1 id="workshop-title">KIRTAN <em>SWAMY.</em></h1><p>Engineering, design and ideas in progress. Step into the workshop.</p></div><button className="workshop-index-trigger" type="button" onClick={openIndex}>OPEN THE NOTEBOOK <b>↗</b></button></div>
    <div className="workshop-stage"><div className="workshop-scene-glow"/><Canvas shadows dpr={[1,1.35]} camera={{position:[0,5.7,9.8],fov:39,near:.1,far:40}} fallback={<Fallback projects={projects} onSelect={onOpenProject} onNotebook={openIndex}/>}>
      <Suspense fallback={null}><Scene projects={projects} selected={selected} hovered={hovered} onSelect={selectProject} onHover={setHovered} onNotebook={openIndex} pointer={reduced?{x:0,y:0}:pointer} reduced={reduced}/></Suspense>
    </Canvas>
    <div className="workshop-object-labels" aria-hidden="true">{projects.map((p,i)=><span key={p.id} data-index={i} className={selected===p.id||hovered===p.id?'is-active':''}>{p.name}</span>)}<span className="notebook-label">THE NOTEBOOK</span></div>
    <div className="workshop-scene-caption"><span>FIG. 001 / THE WORKBENCH</span><span>{selectedProject?'SELECTED / '+selectedProject.name:'MOVE THROUGH THE OBJECTS'}</span></div></div>
    <div className="workshop-controls"><div className="workshop-project-shortcuts" aria-label="Select a project artifact">{shortcuts.map(p=><button key={p.id} type="button" className={selected===p.id?'is-selected':''} onClick={()=>selectProject(projects.find(x=>x.id===p.id))} aria-pressed={selected===p.id}><span>{p.id}</span>{p.name}</button>)}</div><div className="workshop-hint"><span>SELECT AN OBJECT TO OPEN ITS FILE</span><button type="button" onClick={()=>setSelected(null)} disabled={!selected}>RETURN TO OVERVIEW ↗</button></div></div>
    {selectedProject&&<div className="workshop-selected-file" aria-live="polite"><div><span>PROJECT FILE / {selectedProject.id} · {selectedProject.stage}</span><strong>{selectedProject.name}</strong><p>{selectedProject.description}</p></div><button type="button" onClick={()=>onOpenProject(selectedProject)}>READ THE PROJECT NOTE <span>↗</span></button></div>}
    {indexOpen&&<div className="workshop-index-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setIndexOpen(false)}}><section className="workshop-index" role="dialog" aria-modal="true" aria-labelledby="workshop-index-title"><div className="workshop-index-head"><span>THE MAKER'S NOTEBOOK / INDEX</span><button type="button" onClick={()=>setIndexOpen(false)}>CLOSE ×</button></div><h2 id="workshop-index-title">EVERYTHING<br/><em>IN ITS PLACE.</em></h2><nav className="workshop-index-links"><a href="#work" onClick={()=>setIndexOpen(false)}>01 / SELECTED WORK ↗</a><a href="#recognition" onClick={()=>setIndexOpen(false)}>02 / MILESTONES ↗</a><a href="#about" onClick={()=>setIndexOpen(false)}>03 / ABOUT ↗</a><a href="#journey" onClick={()=>setIndexOpen(false)}>04 / JOURNEY ↗</a><a href="#learning" onClick={()=>setIndexOpen(false)}>05 / ARCHIVE ↗</a><a href="#skills" onClick={()=>setIndexOpen(false)}>06 / WORKSHOP ↗</a><a href="#contact" onClick={()=>setIndexOpen(false)}>07 / CONTACT ↗</a></nav></section></div>}
  </section>
}
