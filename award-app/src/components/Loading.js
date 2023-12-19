import spinner from '../assets/svgs/spinner-third.svg';
import styles from './Loading.module.css';

function Loading() {
    return(
       <div className={styles.backdrop}>
            <img src={spinner} className={styles.spinner} alt="Spinner" />
       </div>
    )
}

export default Loading