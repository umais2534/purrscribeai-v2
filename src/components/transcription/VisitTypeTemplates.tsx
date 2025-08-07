import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface VisitTypeTemplate {
  id: string;
  name: string;
  description?: string;
  template: string;
}

interface VisitTypeTemplatesProps {
  onSelectTemplate: (template: VisitTypeTemplate) => void;
}

const VisitTypeTemplates: React.FC<VisitTypeTemplatesProps> = ({
  onSelectTemplate,
}) => {
  // Mock templates - in a real app, these would be stored in a database
  const [templates, setTemplates] = useState<VisitTypeTemplate[]>([
    {
      id: "1",
      name: "SOAP Note",
      description: "Standard SOAP format for medical notes",
      template: "SUBJECTIVE:\n\nOBJECTIVE:\n\nASSESSMENT:\n\nPLAN:\n",
    },
    {
      id: "2",
      name: "Annual Checkup",
      description: "Template for routine annual examinations",
      template:
        "HISTORY:\n\nPHYSICAL EXAMINATION:\n- Weight:\n- Temperature:\n- Heart Rate:\n- Respiratory Rate:\n\nDIAGNOSTICS:\n\nASSESSMENT:\n\nRECOMMENDATIONS:\n",
    },
    {
      id: "3",
      name: "Vaccination Visit",
      description: "Template for vaccination appointments",
      template:
        "PRE-VACCINATION ASSESSMENT:\n\nVACCINES ADMINISTERED:\n\nPOST-VACCINATION INSTRUCTIONS:\n\nNEXT VACCINATION DUE:\n",
    },
  ]);

  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<VisitTypeTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<VisitTypeTemplate>>({
    name: "",
    description: "",
    template: "",
  });

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.template) {
      alert("Please provide a name and template content");
      return;
    }

    const template: VisitTypeTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      description: newTemplate.description,
      template: newTemplate.template,
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: "", description: "", template: "" });
    setIsAddTemplateOpen(false);
  };

  const handleDeleteTemplate = () => {
    if (selectedTemplate) {
      setTemplates(templates.filter((t) => t.id !== selectedTemplate.id));
      setSelectedTemplate(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4 mt-10 mr-8">
     <div className="flex justify-between items-center flex-wrap max-[400px]:flex-col max-[400px]:items-start gap-4 mb-6 bg-gradient-to-r from-[#F0F4FF] to-[#E0ECFF] rounded-xl w-full p-0 sm:p-5 shadow-sm mb-8">
  <h3 className="text-2xl font-bold">Visit Type Templates</h3>
  
  <Dialog open={isAddTemplateOpen} onOpenChange={setIsAddTemplateOpen}>
    <DialogTrigger asChild>
     <Button className="w-full sm:w-auto sm:self-end self-center">

        <Plus className="mr-2 h-4 w-4" />
        Add Template
      </Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Template</DialogTitle>
        <DialogDescription>
          Create a new visit type template to use in your recordings.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            value={newTemplate.name}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, name: e.target.value })
            }
            placeholder="e.g., Dental Examination"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="template-description">Description (Optional)</Label>
          <Input
            id="template-description"
            value={newTemplate.description}
            onChange={(e) =>
              setNewTemplate({
                ...newTemplate,
                description: e.target.value,
              })
            }
            placeholder="Brief description of when to use this template"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="template-content">Template Content</Label>
          <Textarea
            id="template-content"
            value={newTemplate.template}
            onChange={(e) =>
              setNewTemplate({
                ...newTemplate,
                template: e.target.value,
              })
            }
            placeholder="Enter the template structure here..."
            className="min-h-[200px] font-mono"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsAddTemplateOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleAddTemplate}>Create Template</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {templates.map((template) => (
   <Card
  key={template.id}
  className="flex flex-col justify-between h-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:scale-105"
>
  <div className="flex-1 flex flex-col justify-between">
    <CardHeader className="pb-2">
      <CardTitle>
        <div className="relative -mt-6  bg-[#272E3F] text-white text-center pt-0 pb-2 rounded-b-[110px] overflow-hidden w-[60%] mx-auto shadow-md">
          <h2 className="text-[16px] font-semibold z-10 relative">{template.name}</h2>

          {/* Bottom curve */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 500 50"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C125,50 375,50 500,0 L500,50 L0,50 Z"
              fill="#272E3F"
            />
          </svg>
        </div>
      </CardTitle>
      {template.description && (
        <CardDescription>{template.description}</CardDescription>
      )}
    </CardHeader>

    <CardContent className="flex-1">
      <div className="bg-muted/50 p-3 rounded-md min-h-[140px] flex items-start">
        <pre className="text-xs whitespace-pre-wrap font-mono">
          {template.template.length > 100
            ? `${template.template.substring(0, 100)}...`
            : template.template}
        </pre>
      </div>
    </CardContent>
  </div>

  <CardFooter className="flex justify-between mt-auto">
    <AlertDialog
      open={isDeleteDialogOpen && selectedTemplate?.id === template.id}
      onOpenChange={(open) => {
        setIsDeleteDialogOpen(open);
        if (!open) setSelectedTemplate(null);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedTemplate(template)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Template</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the "{template.name}" template?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteTemplate}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <Button
      variant="outline"
      size="sm"
      onClick={() => onSelectTemplate(template)}
      className="bg-[#242C3F] text-white hover:bg-white"
    >
      Use Template
    </Button>
  </CardFooter>
</Card>

  ))}
</div>

    </div>
  );
};

export default VisitTypeTemplates;
