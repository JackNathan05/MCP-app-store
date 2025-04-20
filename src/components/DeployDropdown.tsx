
import { Github, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";

interface Props {
  github: string;
}

const replitDeployUrl = (github: string) =>
  `https://replit.com/github/${encodeURIComponent(github.replace("https://github.com/", ""))}`;

const hfDeployUrl = (github: string) =>
  `https://huggingface.co/new-space?template=${encodeURIComponent(github)}`;

const DeployDropdown = ({ github }: Props) => {
  const handleDeploy = (platform: "replit" | "hf") => {
    const url = platform === "replit" ? replitDeployUrl(github) : hfDeployUrl(github);
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="w-full flex gap-2">
      <Button
        type="button"
        variant="default"
        className="w-full flex gap-2 items-center"
        onClick={() => handleDeploy("replit")}
      >
        <CloudUpload size={16} /> Deploy to Replit
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="w-full flex gap-2 items-center"
        onClick={() => handleDeploy("hf")}
      >
        <CloudUpload size={16} /> Hugging Face
      </Button>
    </div>
  );
};

export default DeployDropdown;
