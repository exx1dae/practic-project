import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  DetectSchema,
  DetectSchemaType,
} from "@/features/DetectHorses/model/schemas/detect-schema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button.tsx";
import { ImageUpload } from "@/components/custom/ImageUpload.tsx";
import { toast } from "sonner";
import {
  useDetectHorsesMutation,
  useLazyVisualizeDetectionQuery,
} from "@/features/DetectHorses";
import { Loader } from "lucide-react";
import { useAppDispatch } from "@/hooks";
import { detectionsSliceActions } from "@/entities/Detections";
import { useEffect } from "react";

export const DetectionForm = () => {
  const methods = useForm<DetectSchemaType>({
    resolver: zodResolver(DetectSchema),
    mode: "onBlur",
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const dispatch = useAppDispatch();

  const [visualize, { isLoading: visualizeLoading }] =
    useLazyVisualizeDetectionQuery();
  const [detectHorses, { isLoading }] = useDetectHorsesMutation();

  useEffect(() => {
    dispatch(
      detectionsSliceActions.setVisualizeDetectionLoading(visualizeLoading),
    );
  }, [visualizeLoading, dispatch]);

  const onSubmit = async (data: DetectSchemaType) => {
    try {
      const formData = new FormData();
      formData.append("file", data.file);
      const { id: detectionId } = await detectHorses(formData).unwrap();

      const blob = await visualize(detectionId).unwrap();

      const url = URL.createObjectURL(blob);
      dispatch(detectionsSliceActions.setPreviewUrl(url));
    } catch (e) {
      toast.error("Произошла непредвиденная ошибка! Попробуйте снова");
      console.error(e);
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Изображение</FormLabel>
              <FormDescription>
                Поддерживаемые форматы изображения (PNG, JPG или JPEG)
              </FormDescription>
              <FormControl>
                <ImageUpload
                  onChange={field.onChange}
                  acceptedTypes="image/png, image/jpg, image/jpeg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? (
            <>
              <Loader />
              Обнаружение...
            </>
          ) : (
            "Обнаружить"
          )}
        </Button>
      </form>
    </Form>
  );
};
