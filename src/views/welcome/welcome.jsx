import './welcome.css'

// Custom Elements
import { CButton } from "../../common/C-button/cButton";
import { CCard } from "../../common/C-card/cCard";
import { CText } from "../../common/C-text/cText";
import { CInput } from "../../common/C-input/cInput";

export const Welcome = () => {
    return (
        <div className="welcome-design">
            <CCard>
                <CInput
                    type={'text'}
                    name={'input'}
                    placeholder={'input text'}
                />
                <CText className={'text-title'} title={'hola que tal'} />
                <CText title={'hola que tal'} />
                <CButton title={'button'} />
            </CCard>
        </div>
    )
}