import { Button } from "./components/ui/button";

interface Props {
  onContinue: () => void;
}

export default function TestIntroPage({ onContinue }: Props) {
  return (
    <div className="page-wrap page-center">
      <button onClick={() => history.back()} className="arrow-btn self-start text-2xl ml-3">←</button>
      <h2 className="text-2xl font-bold mb-4">Testing mode</h2>

      <p className="mb-4">Stand near your kid's bed and wave at the device</p>

        <img
        src="/testmode-graphic.png"
        alt="Wave at the device"
        className="mb-6"
        style={{ maxWidth: "80%" }}
        />

      <p className="mb-4">If nothing pops up after a while, please check your setup</p>

      <Button onClick={onContinue} className="btn end-btn">Continue</Button>
    </div>
  );
}