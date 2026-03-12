import os
import boto3
import uuid
import ffmpeg
from faster_whisper import WhisperModel

# S3 Configuration
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "mock_key")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "mock_secret")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "performova-secure-videos")

# Initialize S3 Client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

# Initialize Whisper Model (we use 'base' for speed, 'large-v3' for highest accuracy)
# Warning: Loading 'large-v3' takes significant memory. We use 'base' for the sandbox.
whisper_model = WhisperModel("base", device="cpu", compute_type="int8")


def upload_to_s3(file_path: str, content_type: str = "video/mp4") -> str:
    """
    Uploads a file to S3 and returns the object key.
    We don't make it public to ensure it remains secure.
    """
    filename = os.path.basename(file_path)
    # Generate a unique key
    object_key = f"videos/{uuid.uuid4()}_{filename}"

    try:
        s3_client.upload_file(
            file_path,
            S3_BUCKET_NAME,
            object_key,
            ExtraArgs={'ContentType': content_type}
        )
        return object_key
    except Exception as e:
        print(f"Error uploading to S3: {e}")
        # Return a mock key if AWS credentials fail in sandbox
        return f"mock_videos/{filename}"


def generate_presigned_url(object_key: str, expiration=3600) -> str:
    """
    Generate a presigned URL to share an S3 object securely.
    This URL expires after the specified time (in seconds).
    """
    if object_key.startswith("mock_videos"):
        return f"https://mock-s3-url.com/{object_key}"

    try:
        response = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': S3_BUCKET_NAME, 'Key': object_key},
            ExpiresIn=expiration
        )
        return response
    except Exception as e:
        print(e)
        return ""


def transcode_video(input_path: str, output_path: str) -> bool:
    """
    Transcodes any video to an optimized web-streaming format (.mp4 with H.264 video and AAC audio).
    """
    try:
        # We use standard fast/web-optimized settings
        (
            ffmpeg
            .input(input_path)
            .output(output_path, vcodec='libx264', acodec='aac', audio_bitrate='128k', preset='fast')
            .overwrite_output()
            .run(quiet=True)
        )
        return True
    except ffmpeg.Error as e:
        print(f"FFmpeg error: {e.stderr.decode() if e.stderr else str(e)}")
        return False


def transcribe_video_audio(video_path: str) -> str:
    """
    Uses faster-whisper to extract audio and transcribe it securely and locally.
    """
    try:
        # Extract audio locally first to feed to Whisper
        temp_audio_path = f"{video_path}_audio.wav"

        (
            ffmpeg
            .input(video_path)
            .output(temp_audio_path, acodec='pcm_s16le', ac=1, ar='16k')
            .overwrite_output()
            .run(quiet=True)
        )

        segments, info = whisper_model.transcribe(temp_audio_path, beam_size=5)

        full_text = ""
        for segment in segments:
            full_text += segment.text + " "

        # Clean up temp audio file
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)

        return full_text.strip()

    except Exception as e:
        print(f"Error transcribing video: {e}")
        return "Audio transcription failed."
