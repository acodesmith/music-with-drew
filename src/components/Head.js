import React from 'react';
import { Helmet } from "react-helmet"

/**
 <meta name="twitter:card" content="summary_large_image">
 <meta name="twitter:site" content="@nytimes">
 <meta name="twitter:creator" content="@SarahMaslinNir">
 <meta name="twitter:title" content="Parade of Fans for Houston’s Funeral">
 <meta name="twitter:description" content="NEWARK - The guest list and parade of limousines with celebrities emerging from them seemed more suited to a red carpet event in Hollywood or New York than than a gritty stretch of Sussex Avenue near the former site of the James M. Baxter Terrace public housing project here.">
 <meta name="twitter:image" content="http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-articleLarge.jpg"
 * @constructor
 */
export const Head = () => (
	<Helmet
		meta={[
			{
				name: `description`,
				content: `Search and share list of musical performances.`,
			},
			{
				name: "keywords",
				content: 'music, sharing, list, live performance, show, bands',
			},
			{
				name: `og:description`,
				content: `Search and share list of musical performances.`,
			},
			{
				name: `twitter:description`,
				content: `Search and share list of musical performances.`,
			},
			{
				name: `og:title`,
				content: `Music with Me!`,
			},
			{
				name: `twitter:title`,
				content: `Music with Me!`,
			},
			{
				name: `og:image`,
				content: `https://music-with-you.s3.amazonaws.com/music-with-me.png`,
			},
			{
				name: `twitter:card`,
				content: `https://music-with-you.s3.amazonaws.com/music-with-me.png`,
			},
			{
				name: `twitter:image`,
				content: `https://music-with-you.s3.amazonaws.com/music-with-me.png`,
			}
		]}
	/>
)