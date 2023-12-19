import { useEffect, useState } from 'react';
import styles from './VideoPrize.module.css';

import volumeSVG from '../assets/svgs/volume.svg';
import volumeSlashSVG from '../assets/svgs/volume-slash.svg';

function VideoPrize(props) {
	const { src, entry } = props
	const [videoReady, setVideoReady] = useState(false)
	const [isHorizontal, setIsHorizontal] = useState(false)
	const [isShowEntry, setIsShowEntry] = useState(false)
	const [isFadeEntry, setIsFadeEntry] = useState(false)
	const [isMuted, setIsMuted] = useState(true)

	const volumeSrc = isMuted
		?
		volumeSlashSVG
		:
		volumeSVG

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth
			const height = window.innerHeight
			const ratio = width / height

			if (ratio < 16 / 9) {
				setIsHorizontal(false)
			} else {
				setIsHorizontal(true)
			}

			if (width < 768 * window.devicePixelRatio) {
				setIsMuted(true)
			} else {
				setIsMuted(false)
			}
		}
		handleResize()
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	const handleTimeUpdate = (e) => {
		if (e.target.currentTime < 13) {
			setIsShowEntry(false)
			setIsFadeEntry(false)
		} else if (e.target.currentTime >= 13 && e.target.currentTime < 27) {
			setIsShowEntry(true)
			setIsFadeEntry(true)
		} else {
			setIsShowEntry(false)
			setIsFadeEntry(true)
		}
	}

	const handleToggleMuted = () => {
		setIsMuted(!isMuted)
	}

	return (
		<>
			<div className={styles.toggleMuted} onClick={handleToggleMuted}>
				<img src={volumeSrc} alt='Toggle Muted' />
			</div>
			{
				<div className={`${styles.videoEntry} ${isHorizontal ? styles.horizontal : ''} ${isShowEntry ? styles.show : styles.hide} ${isFadeEntry ? styles.fade : ''}`}>
					<div className={styles.name}>{entry[1]}</div>
					<div className={styles.prize}>{entry[4]}{entry[5] && ':'}</div>
					{
						entry[5] &&
						<div className={styles.prizeName}>{entry[5]}</div>
					}
				</div>
			}
			<video
				className={`${styles.video} ${videoReady ? styles.show : ''}`}
				src={src}
				muted={isMuted}
				autoPlay={true}
				controls={false}
				loop={true}
				playsInline={true}
				onCanPlay={() => setVideoReady(true)}
				onTimeUpdate={handleTimeUpdate}
			></video>
		</>

	)
}

export default VideoPrize