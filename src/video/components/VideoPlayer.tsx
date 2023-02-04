import { Transition } from "@/components/Transition";
import { useIsMobile } from "@/hooks/useIsMobile";
import { BackdropAction } from "@/video/components/actions/BackdropAction";
import { FullscreenAction } from "@/video/components/actions/FullscreenAction";
import { HeaderAction } from "@/video/components/actions/HeaderAction";
import { LoadingAction } from "@/video/components/actions/LoadingAction";
import { MiddlePauseAction } from "@/video/components/actions/MiddlePauseAction";
import { MobileCenterAction } from "@/video/components/actions/MobileCenterAction";
import { PageTitleAction } from "@/video/components/actions/PageTitleAction";
import { PauseAction } from "@/video/components/actions/PauseAction";
import { ProgressAction } from "@/video/components/actions/ProgressAction";
import { QualityDisplayAction } from "@/video/components/actions/QualityDisplayAction";
import { ShowTitleAction } from "@/video/components/actions/ShowTitleAction";
import { SkipTimeAction } from "@/video/components/actions/SkipTimeAction";
import { TimeAction } from "@/video/components/actions/TimeAction";
import { VolumeAction } from "@/video/components/actions/VolumeAction";
import { VideoPlayerError } from "@/video/components/parts/VideoPlayerError";
import {
  VideoPlayerBase,
  VideoPlayerBaseProps,
} from "@/video/components/VideoPlayerBase";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { ReactNode, useCallback, useState } from "react";

type Props = VideoPlayerBaseProps & {
  onGoBack?: () => void;
};

function CenterPosition(props: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {props.children}
    </div>
  );
}

function LeftSideControls() {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);

  const handleMouseEnter = useCallback(() => {
    controls.setLeftControlsHover(true);
  }, [controls]);
  const handleMouseLeave = useCallback(() => {
    controls.setLeftControlsHover(false);
  }, [controls]);

  return (
    <>
      <div
        className="flex items-center px-2"
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <PauseAction />
        <SkipTimeAction />
        <VolumeAction className="mr-2" />
        <TimeAction />
      </div>
      <ShowTitleAction />
    </>
  );
}

export function VideoPlayer(props: Props) {
  const [show, setShow] = useState(false);
  const { isMobile } = useIsMobile();

  const onBackdropChange = useCallback(
    (showing: boolean) => {
      setShow(showing);
    },
    [setShow]
  );

  // TODO safe area only if full screen or fill screen
  return (
    <VideoPlayerBase autoPlay={props.autoPlay}>
      <PageTitleAction />
      <VideoPlayerError onGoBack={props.onGoBack}>
        <BackdropAction onBackdropChange={onBackdropChange}>
          <CenterPosition>
            <LoadingAction />
          </CenterPosition>
          <CenterPosition>
            <MiddlePauseAction />
          </CenterPosition>
          {isMobile ? (
            <Transition
              animation="fade"
              show={show}
              className="absolute inset-0 flex items-center justify-center"
            >
              <MobileCenterAction />
            </Transition>
          ) : (
            ""
          )}
          <Transition
            animation="slide-down"
            show={show}
            className="pointer-events-auto absolute inset-x-0 top-0 flex flex-col py-6 px-8 pb-2"
          >
            <HeaderAction showControls={isMobile} onClick={props.onGoBack} />
          </Transition>
          <Transition
            animation="slide-up"
            show={show}
            className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col px-4 pb-2 [margin-bottom:env(safe-area-inset-bottom)]"
          >
            <div className="flex w-full items-center space-x-3">
              {isMobile && <TimeAction noDuration />}
              <ProgressAction />
            </div>
            <div className="flex items-center">
              {isMobile ? (
                <div className="grid w-full grid-cols-[56px,1fr,56px] items-center">
                  <div />
                  <div className="flex items-center justify-center">
                    {/* <SeriesSelectionControl /> */}
                    {/* <SourceSelectionControl media={props.media} /> */}
                  </div>
                  <FullscreenAction />
                </div>
              ) : (
                <>
                  <LeftSideControls />
                  <div className="flex-1" />
                  <QualityDisplayAction />
                  {/* <SeriesSelectionControl />
                    <SourceSelectionControl media={props.media} />
                    <AirplayControl />
                    <ChromeCastControl /> */}
                  <FullscreenAction />
                </>
              )}
            </div>
          </Transition>
        </BackdropAction>
        {props.children}
      </VideoPlayerError>
    </VideoPlayerBase>
  );
}
