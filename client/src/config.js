import openSocket from "socket.io-client";

export const baseURL = "http://localhost:5050/youtube-downloader";
export const socket = openSocket("http://localhost:5050");
export const youtubeLink = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
