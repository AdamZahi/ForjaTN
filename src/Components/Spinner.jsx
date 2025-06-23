import React from 'react';
import { IonItem, IonLabel, IonSpinner } from '@ionic/react';
function Spinner(){
    return (
        <div className=" flex flex-col justify-center items-center">
            <IonItem >
                <IonSpinner name="circular" className='text-gray-50'></IonSpinner>
            </IonItem>
        </div>
    );
}
export default Spinner;