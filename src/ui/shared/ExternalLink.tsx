import * as React from "react";
import { openUrl } from "../../shared/utility";

interface ExternalLinkProps {
    href: string;
    children: React.ReactNode;
}

export default function ExternalLink(props: ExternalLinkProps) {
    const openLink = () => {
        openUrl(props.href);
        return false;
    };
    return (
        <a onClick={openLink} href="#">
            {props.children}
        </a>
    );
}
