/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { getPayloadObject, getTelemetryAttributes, IPayLoad, ITelemetryContent } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface ICookieComplianceAcceptButton {
    acceptCookiesButtonText?: string;
    acceptCookiesButtonAriaLabel?: string;

    /**
     * The telemetry content
     */
    telemetryContent?: ITelemetryContent;
    onClose(): void;
}

export const CookieComplianceAcceptButton: React.FC<ICookieComplianceAcceptButton> = ({ acceptCookiesButtonText, acceptCookiesButtonAriaLabel, telemetryContent, onClose }) => {
    const payLoad: IPayLoad = getPayloadObject('click', telemetryContent!, 'accept cookies');
    const attributes = getTelemetryAttributes(telemetryContent!, payLoad);

    return (
        <button
            type='button'
            className='ms-cookie-compliance__accept-button msc-btn'
            aria-label={acceptCookiesButtonAriaLabel}
            onClick={onClose}
            {...attributes}
        >
            {acceptCookiesButtonText}
        </button>);
};
