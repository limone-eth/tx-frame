import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";

import Image from "next/image";

type State = {
  active: string;
  total_button_presses: number;
};

const initialState = { active: "1", total_button_presses: 0 };

const reducer: FrameReducer<State> = (state, action) => {
  return {
    total_button_presses: state.total_button_presses + 1,
    active: action.postBody?.untrustedData.buttonIndex
      ? String(action.postBody?.untrustedData.buttonIndex)
      : "1",
  };
};

// This is a react server component only
export default async function Home({
  searchParams,
  params,
}: {
  searchParams: Record<string, string>;
  params: Record<string, string>;
}) {
  const previousFrame = getPreviousFrame<State>(searchParams);

  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  const { txHash, chain } = params;

  const txUrl = `https://zapper.xyz/event/${chain}/${txHash}`;
  const imageUrl = `https://og.onceupon.gg/card/${txHash}`;
  return (
    <div className="flex flex-col justify-center">
      <a href={txUrl} target="_blank">
        <Image src={imageUrl} alt="tx-img" width={600} height={315} />
      </a>
      <FrameContainer
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage src={imageUrl} />
        <FrameButton href={txUrl}>Check on Zapper ⚡️</FrameButton>
      </FrameContainer>
    </div>
  );
}
