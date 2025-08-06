"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Project {
  id: string
  name: string
  domain: string
  trackingId: string
}

interface DeleteProjectDialogProps {
  project: Project
  onProjectDeleted: () => void
  trigger?: React.ReactNode
}

export function DeleteProjectDialog({ 
  project, 
  onProjectDeleted, 
  trigger 
}: DeleteProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState("")

  const handleDelete = async () => {
    if (confirmText !== project.name) {
      toast.error("Project name doesn't match")
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(result.message || `Project "${project.name}" has been deleted`)
        setOpen(false)
        setConfirmText("")
        onProjectDeleted()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    } finally {
      setIsDeleting(false)
    }
  }

  const isConfirmValid = confirmText === project.name

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Project
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the project
            and all associated data including analytics events.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <h4 className="font-medium text-sm mb-2">Project to be deleted:</h4>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Name:</span> {project.name}
              </div>
              <div>
                <span className="font-medium">Domain:</span> {project.domain}
              </div>
              <div>
                <span className="font-medium">Tracking ID:</span>{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  {project.trackingId}
                </code>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-name" className="text-sm font-medium">
              Type the project name <strong>{project.name}</strong> to confirm:
            </label>
            <input
              id="confirm-name"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={project.name}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              disabled={isDeleting}
            />
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium mb-1">What will be deleted:</p>
                <ul className="space-y-1 text-xs">
                  <li>• All analytics events and data</li>
                  <li>• Project configuration and settings</li>
                  <li>• Team member access</li>
                  <li>• Integration configurations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmValid || isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}