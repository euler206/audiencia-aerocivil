
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface ClearSelectionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
}

const ClearSelectionsDialog: React.FC<ClearSelectionsDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm
}) => {
  const { toast } = useToast();

  const handleConfirm = async () => {
    try {
      const result = await onConfirm();
      
      if (result) {
        toast({
          title: "Operación exitosa",
          description: "Todas las selecciones han sido eliminadas correctamente",
          variant: "default"
        });
      } else {
        throw new Error("No se pudieron eliminar las selecciones");
      }
    } catch (error) {
      console.error("Error al confirmar borrado de selecciones:", error);
      toast({
        title: "Error",
        description: "No se pudieron eliminar las selecciones",
        variant: "destructive"
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará todas las selecciones de plazas de todos los aspirantes. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            className="bg-destructive text-destructive-foreground"
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearSelectionsDialog;
