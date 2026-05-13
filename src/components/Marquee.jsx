const row1 = ['UI/UX Design ✦','Visual Design ✦','Logo Design ✦','Figma ✦','Adobe Illustrator ✦','Adobe Photoshop ✦','Package Design ✦','Brand Identity ✦','Hyderabad ✦','Dzine ✦']
const row2 = ['4+ Years Experience ✦','50+ Projects ✦','Raleway ✦','Design Systems ✦','User Research ✦','Wireframing ✦','Prototyping ✦','Print Design ✦','Motion Design ✦']
const d1 = [...row1, ...row1]
const d2 = [...row2, ...row2]

export default function Marquee() {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {d1.map((t, i) => <span key={i}>{t}</span>)}
      </div>
      <div className="marquee-track reverse">
        {d2.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  )
}
