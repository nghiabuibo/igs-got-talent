import src from '../assets/videos/bg.mp4';
import styles from './VideoBackground.module.css';

function VideoBackground() {
	return (
		<video
			className={styles.video}
			src={src}
			muted={true}
			autoPlay={true}
			controls={false}
			loop={true}
			playsInline={true}
		></video>
	)
}

export default VideoBackground