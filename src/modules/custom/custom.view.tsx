/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import { Alert, Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { ICookieComplianceViewProps } from './custom';

const CookieComplianceView: React.FC<ICookieComplianceViewProps> = props => {
    const { CookieComplianceBanner, AlertProps, Content, acceptButton, text, links } = props;

    return (
        <Module {...CookieComplianceBanner}>
            <Alert className={AlertProps.className} color={AlertProps.color} fade={AlertProps.fade}>
                <Node {...Content}>
                    {text}
                    {links}
                </Node>
                {acceptButton}
            </Alert>
        </Module>
    );
};
export default CookieComplianceView;
