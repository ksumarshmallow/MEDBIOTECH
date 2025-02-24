import os
import json
import logging
import requests
import pandas as pd
from tqdm import tqdm
from datetime import datetime
from dataclasses import dataclass, field
from typing import List, Optional

import googleapiclient.discovery

from utils.arg_parser import parse_args
from utils.logger import setup_logging
from utils.config_parser import ConfigParser

@dataclass
class VideoInfo:
    drug: str
    title: str
    description: str
    transcript: Optional[str]
    published_at: str
    video_url: str

@dataclass
class YouTubeReviewParser:
    config_path: str
    drugs_file_path: str
    output_file_path: str = "output.csv"
    youtube: object = field(init=False)

    def __post_init__(self):
        self.config = ConfigParser().parse(self.config_path)
        self.youtube_api_key = self.config.get('YOUTUBE_API_KEY')
        self.youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=self.youtube_api_key)

        self.search_api_key = self.config.get('SEARCH_API_KEY')

        with open(self.drugs_file_path, "r", encoding="utf-8") as file:
            self.drugs_dict = json.load(file)

    def search_videos(self, query: str, max_results: int = 10) -> List[dict]:
        try:
            request = self.youtube.search().list(
                q=query,
                part="snippet",
                maxResults=max_results,
                type="video"
            )
            response = request.execute()
            return response.get("items", [])
        
        except Exception as e:
            logging.error(f"💥 Cannot search video with '{query}': {e}")
            return []

    def get_transcript(self, video_id: str) -> Optional[str]:
        url = f"https://www.searchapi.io/api/v1/search?api_key={self.search_api_key}"
        params = {
            "engine": "youtube_transcripts",
            "video_id": video_id,
            "lang": "ru",
        }

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            transcripts = data.get("transcripts", [])
            if len(transcripts) > 0:
                full_text = " ".join([item["text"] for item in transcripts])
                return full_text
            else:
                logging.warning(f'😢 Cannot find russian subtitles')
                return None

        except requests.exceptions.RequestException as e:
            logging.error(f'💀 Error with SearchAPI {e}')
            return None


    def parse_reviews(self):
        if os.path.exists(self.output_file_path):
            results_df = pd.read_csv(self.output_file_path)
            existing_titles = set(results_df["title"].tolist())
        else:
            results_df = pd.DataFrame(
                columns=["drug", "title", "description", "transcript", "published_at", "video_url"]
            )
            existing_titles = set()

        for drug, synonyms in self.drugs_dict.items():
            logging.info(f"🔍 Search reviews for: {drug} (synonyms: {' '.join(synonyms)})")

            for synonym in synonyms:
                videos = self.search_videos(f"{synonym} отзыв")

                logging.info(f'🚀 Found {len(videos)} videos')

                if not videos:
                    logging.info(f"🔔 Skip '{synonym}'")
                    continue

                for video in tqdm(videos, colour='GREEN', desc=f'Search reviews for {synonym}'):
                    video_id = video['id']['videoId']
                    title = video['snippet']['title']
                    description = video['snippet']['description']
                    published_at = video['snippet']['publishedAt']
                    video_url = f"https://www.youtube.com/watch?v={video_id}"

                    if title in existing_titles:
                        logging.info(f"🔔 Skip video '{title}' (already in the table)")
                        continue

                    logging.info(f'Parse text from {title} ({video_url})')

                    transcript = self.get_transcript(video_id)

                    if transcript is not None:

                        print(f'🎉 Video text found! \n\n {transcript} \n\n Save into .csv...')

                        video_info = VideoInfo(
                            drug=drug,
                            title=title,
                            description=description,
                            transcript=transcript,
                            published_at=published_at,
                            video_url=video_url
                        )

                        results_df = pd.concat(
                            [results_df, pd.DataFrame([video_info.__dict__])],
                            ignore_index=True
                        )

                        existing_titles.add(title)

                        results_df.to_csv(self.output_file_path, index=False, encoding="utf-8")


if __name__ == "__main__":
    setup_logging()
    args = parse_args()
    parser = YouTubeReviewParser(config_path=args.config, 
                                 drugs_file_path=args.drugs, 
                                 output_file_path=args.output)
    parser.parse_reviews()