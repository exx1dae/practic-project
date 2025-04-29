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
import { useDetectHorsesMutation } from "@/features/DetectHorses";
import { Loader } from "lucide-react";
import { useLazyVisualizeDetectionQuery } from "@/features/DetectHorses/model/api/detectApi.ts";

export const DetectForm = ({ setUrl }: { setUrl: (url: string) => void }) => {
  const methods = useForm<DetectSchemaType>({
    resolver: zodResolver(DetectSchema),
    mode: "onBlur",
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [visualize, { data: blob }] = useLazyVisualizeDetectionQuery();
  const [detectHorses, { isLoading }] = useDetectHorsesMutation();

  const onSubmit = async (data: DetectSchemaType) => {
    try {
      const formData = new FormData();
      formData.append("file", data.file);

      const response = await detectHorses(formData).unwrap();
      await visualize(response.id).unwrap();

      const url = URL.createObjectURL(blob);

      setUrl(url);

      console.log(response);
    } catch (e) {
      toast.error(e.message);
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
