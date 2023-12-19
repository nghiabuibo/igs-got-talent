import certificate from '../assets/svgs/file-certificate.svg';
import download from '../assets/svgs/arrow-down-to-line.svg';
import styles from './Download.module.css'
import { useState } from 'react';

function Download(props) {
	const { scholarshipSrc } = props
	const [isScholarshipBtnHovered, setIsScholarshipBtnHovered] = useState(false)

	const handleMouseEnter = (e) => {
		setIsScholarshipBtnHovered(true)
	}

	const handleMouseLeave = (e) => {
		setIsScholarshipBtnHovered(false)
	}

	return (
		<div className={styles.download}>
			<a
				className={`${styles.downloadBtn} ${styles.scholarshipBtn}`}
				href={scholarshipSrc}
				target='_blank'
				rel='noreferrer'
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<img src={isScholarshipBtnHovered ? download : certificate} alt='Scholarship Download Button' />
			</a>
		</div>
	)
}

export default Download