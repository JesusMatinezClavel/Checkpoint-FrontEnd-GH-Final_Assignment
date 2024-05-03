import './welcome.css'

import { CButton } from "../../common/C-button/cButton";
import { CCard } from "../../common/C-card/cCard";


export const Welcome = () => {
    return (
        <div className="welcome-design">
            <CCard>
                <CButton title={'button'} />
            </CCard>
        </div>
    )
}