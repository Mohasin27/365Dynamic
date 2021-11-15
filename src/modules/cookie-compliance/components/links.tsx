/*--------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * See License.txt in the project root for license information.
 *--------------------------------------------------------------*/

/* eslint-disable no-duplicate-imports */
import * as Msdyn365 from '@msdyn365-commerce/core';
import { getPayloadObject, getTelemetryAttributes, ITelemetryContent, onTelemetryClick } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IActionLinksData } from '../cookie-compliance.props.autogenerated';

export interface ICookieComplianceLinks {
    links: IActionLinksData[];
    requestContext: Msdyn365.IRequestContext;
    telemetryContent: ITelemetryContent;
    onTextChange?(index: number): (event: Msdyn365.ContentEditableEvent) => void;
}

/**
 *
 * ContentCardLinks component.
 * @extends {React.PureComponent<IContentCardLinks>}
 */
export class CookieComplianceLinks extends React.PureComponent<ICookieComplianceLinks> {
    public render(): JSX.Element {
        const editableLinks = this._mapEditableLinks(this.props.links);
        return (
            <span className='ms-cookie-compliance__cta-layer'>
                {editableLinks && editableLinks.length > 0 ? <Msdyn365.Links
                    links={editableLinks}
                    editProps={{ onTextChange: this.props.onTextChange, requestContext: this.props.requestContext }}
                /> : null}
            </span>

        );
    }

    private readonly _mapEditableLinks = (linkdata: IActionLinksData[]): Msdyn365.ILinksData[] | null => {
        if (!linkdata || linkdata.length === 0) {
            return null;
        }
        const editableLinks: Msdyn365.ILinksData[] = [];
        linkdata.forEach((link, index) => {
            // Construct telemetry attribute to render
            const payLoad = getPayloadObject('click', this.props.telemetryContent, '', '');
            const linkText = link.linkText ? link.linkText : '';
            payLoad.contentAction.etext = linkText;
            const attributes = getTelemetryAttributes(this.props.telemetryContent, payLoad);
            const editableLink: Msdyn365.ILinksData = {
                ariaLabel: link.ariaLabel,
                className: 'link',
                linkText: link.linkText,
                linkUrl: link.linkUrl.destinationUrl,
                openInNewTab: link.openInNewTab,
                role: 'link',
                additionalProperties: attributes,
                onClick: onTelemetryClick(this.props.telemetryContent, payLoad, linkText)
            };
            editableLinks.push(editableLink);
        });

        return editableLinks;
    };
}

export default CookieComplianceLinks;
