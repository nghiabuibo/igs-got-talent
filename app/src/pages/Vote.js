import stylesHome from "../pages/Home.module.css"
import stylesTimeline from '../sections/Timeline.module.css'
import styles from "./Vote.module.css"

import Logo from "../sections/Logo"

import round2Img from "../assets/image/vote-round-2.png"
import voteIntroImg from "../assets/image/vote-intro.png"

import Gallery from "../sections/Gallery"
import Box from "../components/Box"

// import emailIcon from "../assets/svg/email-icon.svg"
import phoneIcon from "../assets/svg/phone-icon.svg"
import igtLogo from "../assets/image/igt-logo.png"

function Round2() {
    return (
        <div className={`row ${styles.round2Wrapper}`}>
            <div className="col-lg-10 offset-lg-1">
                <img src={round2Img} alt="Round 2" className="img-fluid user-select-none pe-none" />
            </div>
        </div>
    )
}

function Intro() {
    return (
        <div className="row mb-5 pb-5 align-items-center">
            <div className="col-md-4">
                <img src={voteIntroImg} alt="Voting Intro" className="img-fluid user-select-none pe-none" />
            </div>
            <div className="col-md-8">
                <Box>
                    <ul className={`mb-0 ${stylesTimeline.unStyle} ${stylesTimeline.customBullet} ${stylesTimeline.timelineList}`}>
                        <li>
                            Scoring and voting deadline:<br />
                            <strong>At 11:59 PM on 10th December 2023.</strong>
                        </li>
                        <li>
                            Regarding the voting mechanism:<br />
                            <strong>One account can vote for multiple performances simultaneously but each performance can only be voted once.</strong>
                        </li>
                        <li>All votes that involve virtual interferences, inaccurate information, or violate any of the mentioned regulations may be refused by The Organizing Committee, leading to disqualification of the submitted act or revocation of prizes.</li>
                    </ul>
                </Box>
            </div>
        </div>
    )
}

function Outro() {
    return (
        <div className="row pb-5">
            {/* <p>Ivy Global School là trường Quốc tế Mỹ trực tuyến, được thành lập tại Florida, USA.</p>
            <p>Các nội dung giảng dạy tại <strong>Ivy Global School</strong> được cung cấp bởi các tổ chức giáo dục, trường học uy tín tại Mỹ, theo chuẩn Common Core State Standards của Bộ Giáo Dục Mỹ, và được kiểm định bởi Cognia - Tổ chức kiểm định chất lượng lớn nhất tại Mỹ.</p>
            <p className="d-flex align-items-center gap-3">
                <img src={emailIcon} className={styles.outroIcon} alt="Email" />
                <a href="mailto:info@ivyglobalschool.org" className="text-white">info@ivyglobalschool.org</a>
            </p> */}
            <p className="d-flex align-items-center justify-content-center gap-3">
                <img src={phoneIcon} className={styles.outroIcon} alt="Phone" />
                <span>
                    Northern Region: <a href="tel:0898083111" className="text-white">0898 083 111</a>
                    <br />
                    Southern Region: <a href="tel:0906924592" className="text-white">0906 924 592</a>
                </span>
            </p>
            <div className="text-center">
                <img src={igtLogo} className={`img-fluid user-select-none pe-none ${styles.outroLogo}`} alt="IGT Logo" />
            </div>
        </div>
    )
}

function Vote() {
    return (
        <div className={`container ${stylesHome.home}`}>
            <Logo igtLogo={true} />
            <Round2 />
            <Intro />
            <Gallery />
            <Outro />
        </div>
    )
}

export default Vote