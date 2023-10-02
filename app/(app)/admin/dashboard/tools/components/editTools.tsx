"use client";
import { Button, Drawer, useToast } from "@medusajs/ui";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Name } from "./fields/name";
import { Description } from "./fields/description";
import { ToolsSchema, toolsSchema } from "@/schema/tools.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Summary } from "./fields/summary";
import { Pricing } from "./fields/pricing";
import { WebsiteURl } from "./fields/websiteUrl";
import { PlayStoreURL } from "./fields/playStoreURL";
import { AppStoreURL } from "./fields/appStoreURL";
import { FeatureAt } from "./fields/featuredAt";
import { IsToolPublished } from "./fields/isToolPublished";
import { Tags } from "./fields/tags";
import { PossibleUseCase } from "./fields/possibleUseCase";
import { ImageURL } from "./fields/imageUrls";
import axios from "axios";
import { mutate } from "swr";

export const EditTools = ({
  tool,
  onClose,
}: {
  tool?: Tool;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ToolsSchema>({
    resolver: zodResolver(toolsSchema),
    defaultValues: {
      ...tool,
      possibleUseCase: tool?.possibleUseCase.map(
        ({ description }) => description
      ),
      imageURLs: tool?.imageURLs.map(({ imageURL }) => imageURL),
    },
  });
  const { toast } = useToast();
  const { handleSubmit } = form;
  const addTool = async (value: ToolsSchema) => {
    try {
      setIsLoading(true);
      const { data } = await axios.put<Tool>(`/api/tools/${tool?.toolId}`, {
        ...value,
      });
      mutate<Tool[]>("/api/tools", async (oldData) => {
        if (oldData) return [...oldData, data];
      });
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Updated tool",
        variant: "success",
        duration: 2000,
      });
    } catch (e: any) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "unable to update tool",
        variant: "error",
        duration: 2000,
      });
    }
  };

  return (
    <Drawer open={!!tool}>
      <Drawer.Content onEscapeKeyDown={() => onClose()}>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(addTool)}>
            <Drawer.Header className="max-w-7xl m-auto w-full">
              Update AI tool
            </Drawer.Header>
            <Drawer.Body className="flex  flex-col gap-y-8 h-[calc(100vh-165px)] overflow-y-auto">
              <Name />
              <Description />
              <Summary />
              <PossibleUseCase />
              <ImageURL />
              <Tags />
              <Pricing />
              <FeatureAt />
              <WebsiteURl />
              <PlayStoreURL />
              <AppStoreURL />
              <IsToolPublished />
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button
                  disabled={isLoading}
                  onClick={() => onClose()}
                  variant="secondary"
                >
                  Cancel
                </Button>
              </Drawer.Close>
              <Button type="submit" isLoading={isLoading}>
                Save
              </Button>
            </Drawer.Footer>
          </form>
        </FormProvider>
      </Drawer.Content>
    </Drawer>
  );
};
