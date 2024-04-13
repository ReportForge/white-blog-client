import React from 'react';
import { Helmet } from 'react-helmet-async';
export default function SEO({ title, description, name, type }) {
    console.log(title);
    console.log(description);
    console.log(name);
    console.log(type);
    return (
        <Helmet>
            { /* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description} />
            { /* End standard metadata tags */}
            { /* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            { /* End Facebook tags */}
            { /* Twitter tags */}
            <meta name="twitter:creator" content={name} data-react-helmet="true"/>
            <meta name="twitter:card" content={type} data-react-helmet="true"/>
            <meta property='twitter:title' content={title} data-react-helmet="true"/>
            <meta name="twitter:description" content={description} data-react-helmet="true"/>
            { /* End Twitter tags */}
        </Helmet>
    )
}