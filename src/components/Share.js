import React from "react";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  RedditShareButton,
  RedditIcon,
  TumblrShareButton,
  TumblrIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import { isServer } from "../util/server";

export const Share = () => {
  const url = isServer || window.location.toString();
  const quote = "My Music List - Music With You";
  const size = 30;

  return (
		<div className="p-2">
			<div className="mx-auto max-w-sm mb-2 rounded flex justify-around p-1">
				<FacebookShareButton url={url} quote={quote}>
					<FacebookIcon size={size} round />
				</FacebookShareButton>
				<RedditShareButton url={url} quote={quote}>
					<RedditIcon size={size} round />
				</RedditShareButton>
				<TumblrShareButton  url={url} quote={quote}>
					<TumblrIcon  size={size} round />
				</TumblrShareButton>
				<TwitterShareButton url={url} quote={quote}>
					<TwitterIcon size={size} round />
				</TwitterShareButton>
				<WhatsappShareButton url={url} quote={quote}>
					<WhatsappIcon size={size} round />
				</WhatsappShareButton>
				<EmailShareButton url={url} quote={quote}>
					<EmailIcon size={size} round />
				</EmailShareButton>
			</div>
		</div>
  );
};
