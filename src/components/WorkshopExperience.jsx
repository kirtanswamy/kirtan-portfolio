import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import './WorkshopExperience.css'

const artifactPositions = [[-3.25,.08,-1.35],[3.2,.08,-1.3],[-3.35,.08,1.5],[3.35,.08,1.5],[0,.08,-2.45]]
const artifactColors = ['#d8d0bf','#c9b995','#6d8f83','#b77b5d','#b98f5d']

function Desk() {
  return <group>
    <mesh receiveShadow position={[0,-.25,0]}><boxGeometry args={[11.5,.42,7.8]}/><meshStandardMaterial color="#493728" roughness={.48}/></mesh>
    <mesh position={[0,-.025,0]}><boxGeometry args={[11.38,.055,7.68]}/><meshStandardMaterial color="#6c5038" roughness={.42}/></mesh>
    {[-4.8,4.8].flatMap(x=>[-3.1,3.1].map(z=><mesh key={x+':'+z} position={[x,-1.1,z]}><boxGeometry args={[.22,2,.22]}/><meshStandardMaterial color="#29231e" roughness={.7}/></mesh>))}
    {Array.from({length:7},(_,i)=><mesh key={i} position={[-4.6+i*1.52,.006,-3.78]}><boxGeometry args={[1.35,.012,.018]}/><meshStandardMaterial color="#a17a53" roughness={.6}/></mesh>)}
    <mesh position={[0,.015,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[11.2,7.5]}/><meshStandardMaterial color="#594331" roughness={.65}/></mesh>
  </group>
}
function Notebook({onOpen}) {
  return <group position={[0,.13,.12]} rotation={[-.04,.04,-.035]} onClick={e=>{e.stopPropagation();onOpen()}}>
    <mesh castShadow receiveShadow position={[0,0,0]}><boxGeometry args={[2.9,.22,2.22]}/><meshStandardMaterial color="#62442f" roughness={.88}/></mesh>
    <mesh position={[-.72,.124,0]}><boxGeometry args={[1.34,.025,2.08]}/><meshStandardMaterial color="#e8dfce" roughness={.95}/></mesh>
    <mesh position={[.72,.124,0]}><boxGeometry args={[1.34,.025,2.08]}/><meshStandardMaterial color="#f0e8d8" roughness={.95}/></mesh>
    <mesh position={[0,.143,0]}><boxGeometry args={[.09,.035,2.12]}/><meshStandardMaterial color="#3b2b21" roughness={.8}/></mesh>
    {[-.78,-.55,-.32,-.09,.14,.37,.6,.83].flatMap((z,i)=>[-.72,.72].map((x,j)=><mesh key={i+':'+j} position={[x+(j?-.12:.1),.142,z]}><boxGeometry args={[i%3===0?.82:.98,.006,.012]}/><meshStandardMaterial color="#b7aa95"/></mesh>))}
    <mesh position={[-.94,.16,.88]} rotation={[0,0,-.16]}><boxGeometry args={[.24,.018,.42]}/><meshStandardMaterial color="#557bff"/></mesh>
    <mesh position={[.95,.16,-.87]} rotation={[0,0,.12]}><boxGeometry args={[.18,.018,.34]}/><meshStandardMaterial color="#c58c55"/></mesh>
    <mesh position={[0,.24,-1.05]}><boxGeometry args={[.72,.025,.08]}/><meshStandardMaterial color="#b99a66"/></mesh>
  </group>
}
function Lamp() {
  return <group position={[-4.45,.05,-2.55]}>
    <mesh position={[0,.06,0]}><cylinderGeometry args={[.42,.48,.12,32]}/><meshStandardMaterial color="#272b2b" metalness={.72} roughness={.3}/></mesh>
    <mesh position={[0,.72,0]} rotation={[0,0,-.28]}><cylinderGeometry args={[.055,.07,1.25,16]}/><meshStandardMaterial color="#8d795d" metalness={.7}/></mesh>
    <mesh position={[.18,1.34,0]} rotation={[0,0,-.45]}><coneGeometry args={[.48,.52,32,1,true]}/><meshStandardMaterial color="#b99a66" metalness={.58} roughness={.32} side={THREE.DoubleSide}/></mesh>
    <pointLight position={[.28,1.05,.05]} intensity={18} distance={5} color="#ffd39a"/>
  </group>
}
function Monitor() {
  return <group position={[0,.9,-3.18]}>
    <mesh castShadow position={[0,.52,0]}><boxGeometry args={[2.25,1.38,.16]}/><meshStandardMaterial color="#292d2d" metalness={.35} roughness={.4}/></mesh>
    <mesh position={[0,.54,.09]}><boxGeometry args={[2.05,1.17,.025]}/><meshStandardMaterial color="#172c34" emissive="#244d5c" emissiveIntensity={.48} roughness={.3}/></mesh>
    <mesh position={[0,-.28,0]}><boxGeometry args={[.22,.5,.2]}/><meshStandardMaterial color="#353735" metalness={.45}/></mesh>
    <mesh position={[0,-.52,.08]}><boxGeometry args={[.9,.09,.48]}/><meshStandardMaterial color="#292d2d" metalness={.45}/></mesh>
    {[ -.68,-.42,-.16,.1,.36,.62 ].map((x,i)=><mesh key={i} position={[x,.83,.115]}><boxGeometry args={[.16,.025,.01]}/><meshStandardMaterial color={i===2?'#a9baff':'#9d9b8b'}/></mesh>)}
  </group>
}
function Artifact({project,index,selected,hovered,onSelect,onHover}) {
  const group=useRef()
  useFrame((_,dt)=>{if(group.current){const lift=selected?.2:hovered?.1:0;group.current.position.y=THREE.MathUtils.damp(group.current.position.y,.08+lift,5,dt)}})
  const color=artifactColors[index]
  return <group ref={group} position={artifactPositions[index]} onClick={e=>{e.stopPropagation();onSelect(project)}} onPointerOver={e=>{e.stopPropagation();onHover(project.id)}} onPointerOut={()=>onHover(null)}>
    {index===0 && <group>
      <mesh castShadow><boxGeometry args={[1.22,.16,1.5]}/><meshStandardMaterial color="#d9d1c1" roughness={.9}/></mesh>
      <mesh position={[0,.1,0]}><boxGeometry args={[1.08,.035,1.34]}/><meshStandardMaterial color="#e9e1d1"/></mesh>
      <mesh position={[0,.125,-.48]}><boxGeometry args={[.88,.018,.18]}/><meshStandardMaterial color="#a65e4b"/></mesh>
      <mesh position={[0,.13,.02]}><boxGeometry args={[.8,.012,.012]}/><meshStandardMaterial color="#918776"/></mesh>
      <mesh position={[0,.13,.19]}><boxGeometry args={[.62,.012,.012]}/><meshStandardMaterial color="#918776"/></mesh>
      <mesh position={[.42,.17,.48]} rotation={[0,0,-.08]}><boxGeometry args={[.22,.12,.28]}/><meshStandardMaterial color="#557bff"/></mesh>
    </group>}
    {index===1 && <group>
      <mesh castShadow><boxGeometry args={[1.18,.18,1.48]}/><meshStandardMaterial color="#927c5e"/></mesh>
      <mesh position={[0,.11,0]}><boxGeometry args={[1.02,.035,1.3]}/><meshStandardMaterial color="#e6d8bd"/></mesh>
      <mesh position={[0,.14,-.48]}><boxGeometry args={[.86,.025,.22]}/><meshStandardMaterial color="#526b83"/></mesh>
      {[-.28,0,.28].map((x,i)=><mesh key={i} position={[x,.15,.05]}><boxGeometry args={[.19,.02,.58]}/><meshStandardMaterial color={i===1?'#b77b5d':'#8d9b8a'}/></mesh>)}
      <mesh position={[0,.18,.55]}><boxGeometry args={[.82,.025,.12]}/><meshStandardMaterial color="#c2a16c"/></mesh>
    </group>}
    {index===2 && <group>
      <mesh castShadow><boxGeometry args={[1.3,.15,.98]}/><meshStandardMaterial color="#293b38" roughness={.7}/></mesh>
      {Array.from({length:6},(_,i)=><mesh key={i} position={[-.48+i*.19,.09,0]}><boxGeometry args={[.06,.055,.68]}/><meshStandardMaterial color={i%2?'#d8a15e':'#6c9c91'} metalness={.4}/></mesh>)}
      <mesh position={[0,.2,-.12]}><cylinderGeometry args={[.16,.16,.2,24]}/><meshStandardMaterial color="#d8d0bf" metalness={.55}/></mesh>
      <mesh position={[.43,.16,.3]}><boxGeometry args={[.26,.1,.22]}/><meshStandardMaterial color="#c45f4f"/></mesh>
      <mesh position={[-.43,.16,-.3]}><boxGeometry args={[.26,.1,.22]}/><meshStandardMaterial color="#c58e4f"/></mesh>
    </group>}
    {index===3 && <group>
      <mesh castShadow rotation={[-Math.PI/2,0,0]}><boxGeometry args={[1.35,1.25,.08]}/><meshStandardMaterial color="#d6c8ae"/></mesh>
      <mesh position={[0,.055,.05]} rotation={[0,0,-.3]}><boxGeometry args={[.07,.025,.9]}/><meshStandardMaterial color="#557bff"/></mesh>
      {[-.42,-.05,.34].map((x,i)=><mesh key={i} position={[x,.06,.18-i*.18]}><sphereGeometry args={[.095,16,16]}/><meshStandardMaterial color={i===1?'#c65e4c':'#668b76'}/></mesh>)}
      <mesh position={[0,.09,.51]}><boxGeometry args={[.85,.018,.05]}/><meshStandardMaterial color="#8b795e"/></mesh>
    </group>}
    {index===4 && <group>
      <mesh castShadow position={[0,.35,0]}><boxGeometry args={[1.24,.92,.68]}/><meshStandardMaterial color="#5d4938" roughness={.55}/></mesh>
      <mesh position={[0,.38,.36]}><boxGeometry args={[1.02,.68,.035]}/><meshStandardMaterial color="#252d30" emissive="#31566a" emissiveIntensity={.55}/></mesh>
      <mesh position={[0,.38,.385]}><planeGeometry args={[.82,.52]}/><meshBasicMaterial color="#a7b9a0"/></mesh>
      <mesh position={[0,-.14,.08]}><boxGeometry args={[.78,.09,.52]}/><meshStandardMaterial color="#3b3028"/></mesh>
      <mesh position={[.86,.02,.25]} rotation={[0,0,-.08]}><boxGeometry args={[.2,.06,.48]}/><meshStandardMaterial color="#d8c9b0"/></mesh>
      <mesh position={[.86,.06,.25]}><cylinderGeometry args={[.045,.045,.02,16]}/><meshStandardMaterial color="#b95d4c"/></mesh>
    </group>}
    <mesh position={[0,-.13,0]}><cylinderGeometry args={[.045,.06,.1,16]}/><meshStandardMaterial color={color} metalness={.3}/></mesh>
  </group>
}
function CameraRig({selectedIndex,pointer,reduced}) {
  const {camera}=useThree()
  const look=useRef(new THREE.Vector3(0,.1,0))
  useFrame((_,dt)=>{
    if(reduced)return
    const p=selectedIndex<0?[0,6.5,11.8]:[artifactPositions[selectedIndex][0]*.72,4.2,7.1]
    camera.position.lerp(new THREE.Vector3(p[0]+pointer.x*.12,p[1]-pointer.y*.1,p[2]),1-Math.exp(-dt*1.8))
    const target=selectedIndex<0?new THREE.Vector3(0,.35,-.2):new THREE.Vector3(artifactPositions[selectedIndex][0]*.65,.25,artifactPositions[selectedIndex][2]*.55)
    look.current.lerp(target,1-Math.exp(-dt*2.1))
    camera.lookAt(look.current)
  })
  return null
}
function Scene({projects,selected,hovered,onSelect,onHover,onNotebook,pointer,reduced}) {
  const index=projects.findIndex(p=>p.id===selected)
  return <>
    <color attach="background" args={['#171817']}/><fog attach="fog" args={['#171817',11,22]}/>
    <ambientLight intensity={.48}/>
    <directionalLight castShadow position={[-3,9,5]} intensity={2.25} color="#ffe3bd" shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
    <pointLight position={[4,4,-3]} intensity={18} distance={11} color="#557bff"/>
    <pointLight position={[-4,3,1]} intensity={12} distance={9} color="#d3a66f"/>
    <Desk/><Lamp/><Monitor/><Notebook onOpen={onNotebook}/>
    {projects.map((p,i)=><Artifact key={p.id} project={p} index={i} selected={selected===p.id} hovered={hovered===p.id} onSelect={onSelect} onHover={onHover}/>)}
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
  useEffect(()=>{if(!indexOpen)return;const onKey=e=>{if(e.key==='Escape')setIndexOpen(false)};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[indexOpen])
  const movePointer=e=>{if(reduced||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();setPointer({x:((e.clientX-r.left)/r.width-.5)*2,y:((e.clientY-r.top)/r.height-.5)*2})}
  const selectProject=p=>{if(!p)return;setSelected(p.id);setIndexOpen(false)}
  const openIndex=()=>setIndexOpen(true)
  return <section className="workshop-hero" id="main-content" aria-labelledby="workshop-title" onPointerMove={movePointer} onPointerLeave={()=>setPointer({x:0,y:0})}>
    <div className="workshop-topline"><span>THE MAKER'S NOTEBOOK / VOL. 01</span><span>HYDERABAD, INDIA · 2026</span><span>ENGINEERING / DESIGN / IDEAS</span></div>
    <div className="workshop-intro"><div><span className="workshop-kicker">AN INDEPENDENT MAKER'S WORKSPACE</span><h1 id="workshop-title">KIRTAN <em>SWAMY.</em></h1><p>Engineering, design and ideas in progress. Step into the workshop.</p></div><button className="workshop-index-trigger" type="button" onClick={openIndex}>OPEN THE NOTEBOOK <b>↗</b></button></div>
    <div className="workshop-stage"><div className="workshop-scene-glow"/><Canvas shadows dpr={[1,1.25]} camera={{position:[0,6.5,11.8],fov:35,near:.1,far:45}} fallback={<Fallback projects={projects} onSelect={p=>{setSelected(p.id);onOpenProject(p)}} onNotebook={openIndex}/>}>
      <Suspense fallback={null}><Scene projects={projects} selected={selected} hovered={hovered} onSelect={selectProject} onHover={setHovered} onNotebook={openIndex} pointer={reduced?{x:0,y:0}:pointer} reduced={reduced}/></Suspense>
    </Canvas>
    <div className="workshop-object-labels" aria-hidden="true">{projects.map((p,i)=><span key={p.id} data-index={i} className={selected===p.id||hovered===p.id?'is-active':''}>{p.name}</span>)}<span className="notebook-label">THE NOTEBOOK</span></div>
    <div className="workshop-scene-caption"><span>FIG. 001 / THE WORKBENCH</span><span>{selectedProject?'SELECTED / '+selectedProject.name:'SELECT AN ARTIFACT TO EXPLORE'}</span></div></div>
    <div className="workshop-controls"><div className="workshop-project-shortcuts" aria-label="Select a project artifact">{shortcuts.map(p=><button key={p.id} type="button" className={selected===p.id?'is-selected':''} onClick={()=>selectProject(projects.find(x=>x.id===p.id))} aria-pressed={selected===p.id}><span>{p.id}</span>{p.name}</button>)}</div><div className="workshop-hint"><span>SELECT AN OBJECT TO OPEN ITS FILE</span><button type="button" onClick={()=>setSelected(null)} disabled={!selected}>RETURN TO OVERVIEW ↗</button></div></div>
    {selectedProject&&<div className="workshop-selected-file" aria-live="polite"><div><span>PROJECT FILE / {selectedProject.id} · {selectedProject.stage}</span><strong>{selectedProject.name}</strong><p>{selectedProject.description}</p></div><button type="button" onClick={()=>onOpenProject(selectedProject)}>READ THE PROJECT NOTE <span>↗</span></button></div>}
    {indexOpen&&<div className="workshop-index-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setIndexOpen(false)}}><section className="workshop-index" role="dialog" aria-modal="true" aria-labelledby="workshop-index-title"><div className="workshop-index-head"><span>THE MAKER'S NOTEBOOK / INDEX</span><button type="button" onClick={()=>setIndexOpen(false)}>CLOSE ×</button></div><h2 id="workshop-index-title">EVERYTHING<br/><em>IN ITS PLACE.</em></h2><nav className="workshop-index-links"><a href="#work" onClick={()=>setIndexOpen(false)}>01 / SELECTED WORK ↗</a><a href="#recognition" onClick={()=>setIndexOpen(false)}>02 / MILESTONES ↗</a><a href="#about" onClick={()=>setIndexOpen(false)}>03 / ABOUT ↗</a><a href="#journey" onClick={()=>setIndexOpen(false)}>04 / JOURNEY ↗</a><a href="#learning" onClick={()=>setIndexOpen(false)}>05 / ARCHIVE ↗</a><a href="#skills" onClick={()=>setIndexOpen(false)}>06 / WORKSHOP ↗</a><a href="#contact" onClick={()=>setIndexOpen(false)}>07 / CONTACT ↗</a></nav></section></div>}
  </section>
}
