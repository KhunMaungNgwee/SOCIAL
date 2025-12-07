import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Send,
  Image as ImageIcon,
  MoreVertical,
} from "lucide-react";
import { toast } from "../../components/ui/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import {
  usePostsQuery,
  useCommentMutation,
  useReactionMutation,
} from "../../api/newfeed";
import { useCreatePostMutation } from "../../api/post";
import { X } from "lucide-react";
import { useUploadImageMutation } from "../../api/upload";

const CreatePostSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required"),
  image: z.string().optional(),
});

type CreatePostForm = z.infer<typeof CreatePostSchema>;

const HomeFeedView = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(
    null
  );
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>(
    {}
  );

 
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const uploadImageMutation = useUploadImageMutation();
  const createPostForm = useForm<CreatePostForm>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      content: "",
      image: "",
    },
  });

  const {
    data: postsData,
    isLoading: isLoadingPosts,
    isError: isPostsError,
    refetch: refetchPosts,
  } = usePostsQuery(page, pageSize);

  const createPostMutation = useCreatePostMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post created successfully",
        variant: "success",
      });

      createPostForm.reset({
        content: "",
        image: "",
      });

      setSelectedFile(null);
      setImagePreview("");
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh posts
      refetchPosts();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  // Comment mutation
  const commentMutation = useCommentMutation({
    onSuccess: (response, variables) => {
      setCommentInputs((prev) => ({ ...prev, [variables.postId]: "" }));
      setActiveCommentPostId(null);

      toast({
        description: "Comment added successfully",
        variant: "success",
      });
      refetchPosts();
    },
    onError: (error: Error) => {
      toast({
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  // Reaction mutation
  const reactionMutation = useReactionMutation({
    onSuccess: () => {
      refetchPosts();
    },
    onError: (error: Error) => {
      toast({
        description: error.message || "Failed to update reaction",
        variant: "destructive",
      });
    },
  });
  const handleCreatePost = async (data: CreatePostForm) => {
    if (imagePreview && selectedFile) {
      setIsUploading(true);

      try {
        uploadImageMutation.mutate(selectedFile, {
          onSuccess: (imageUrl: string) => {
            const postData = {
              title: data.title || `Post ${new Date().toLocaleDateString()}`,
              content: data.content,
              image: imageUrl,
            };
            createPostMutation.mutate(postData);
            setIsUploading(false);
          },
          onError: (error) => {
            toast({
              title: "Upload Failed",
              description: error.message || "Failed to upload image",
              variant: "destructive",
            });
            setIsUploading(false);
          },
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process image upload",
          variant: "destructive",
        });
        setIsUploading(false);
      }
    } else {
      const postData = {
        title: data.title || `Post ${new Date().toLocaleDateString()}`,
        content: data.content,
        ...(data.image && data.image.trim() && { image: data.image }),
      };

      createPostMutation.mutate(postData);
    }
  };
  const handleLike = (postId: number) => {
    reactionMutation.mutate({ postId, dto: { type: "like" } });
  };

  const handleComment = (postId: number) => {
    const content = commentInputs[postId];
    if (content?.trim()) {
      commentMutation.mutate({ postId, dto: { content } });
    }
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const posts = postsData?.data || [];
  const hasMore = posts.length >= pageSize;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select an image (JPEG, PNG, GIF, WebP)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

  };


  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview("");
    createPostForm.setValue("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  if (isPostsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Failed to load posts
          </h2>
          <p className="text-gray-500 mt-2">Please try again later</p>
          <Button onClick={() => refetchPosts()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Home</h1>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {/* Create Post Card */}
        <Card className="rounded-none border-x-0 border-t-0 shadow-none">
          <CardHeader className="pb-3">
            <h2 className="text-lg font-semibold">Create a post</h2>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={createPostForm.handleSubmit(handleCreatePost)}
              className="space-y-4"
            >
              {/* Hidden title field - auto-generated from content */}
              <input type="hidden" {...createPostForm.register("title")} />

              {/* Content Field - This will auto-generate the title */}
              <div>
                <Textarea
                  placeholder="What's happening in your world?"
                  {...createPostForm.register("content")}
                  className="min-h-[100px] resize-none border-0 text-base p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                  disabled={createPostMutation.isPending}
                  onChange={(e) => {
                    const content = e.target.value;
                    if (content.trim()) {
                      const firstLine = content.split("\n")[0].trim();
                      const title =
                        firstLine.substring(0, 50) +
                        (firstLine.length > 50 ? "..." : "");
                      createPostForm.setValue("title", title || "New Post");
                    }
                  }}
                />
                {createPostForm.formState.errors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {createPostForm.formState.errors.content.message}
                  </p>
                )}
              </div>
              {/* Image Upload Section */}
              <div className="space-y-3">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading || createPostMutation.isPending}
                />

                {/* Upload Button */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || createPostMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4" />
                        <span>Photo</span>
                      </>
                    )}
                  </button>

                  {/* Upload Status */}
                  {isUploading && (
                    <div className="text-sm text-blue-600">
                      Uploading image...
                    </div>
                  )}

                  {/* Image Preview Status */}
                  {imagePreview && !isUploading && (
                    <div className="relative">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <ImageIcon className="h-4 w-4" />
                        <span>Image ready</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative mt-3">
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-h-[300px] object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {selectedFile && (
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex justify-between items-center">
                          <span>File: {selectedFile.name}</span>
                          <span>{Math.round(selectedFile.size / 1024)}KB</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Or use URL field as fallback */}
                {!imagePreview && (
                  <>
                    {createPostForm.formState.errors.image && (
                      <p className="text-red-500 text-sm mt-1 ml-6">
                        {createPostForm.formState.errors.image.message}
                      </p>
                    )}
                  </>
                )}
              </div>
              {createPostForm.formState.errors.image && (
                <p className="text-red-500 text-sm mt-1 ml-6">
                  {createPostForm.formState.errors.image.message}
                </p>
              )}

              <div className="flex items-center justify-between border-t pt-4">
               
                <Button
                  type="submit"
                  disabled={createPostMutation.isPending || isUploading}
                  className="w-full bg-gray-700"
                >
                  {isUploading
                    ? "Uploading image..."
                    : createPostMutation.isPending
                    ? "Posting..."
                    : "Share Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        {isLoadingPosts && page === 1 ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-semibold text-gray-700">
              No posts yet
            </h3>
            <p className="text-gray-500 mt-1">
              Be the first to share something!
            </p>
          </div>
        ) : (
          <>
            {/* Posts List */}
            {posts.map((post) => (
              <Card
                key={post.id}
                className="rounded-none border-x-0 border-t-0 shadow-none"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.name}`}
                        />
                        <AvatarFallback>
                          {post.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {post.author.name}
                        </h3>
                        {post.createdAt && (
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(post.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-3">
                  {/* Show title only if it's meaningful */}
                  {post.title && !post.title.startsWith("Post ") && (
                    <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                  )}
                  <p className="text-gray-800 whitespace-pre-wrap text-base">
                    {post.content}
                  </p>

                  {post.image && post.image.trim() !== "" && (
                    <div className="mt-3 rounded-lg overflow-hidden border">
                      <img
                        src={post.image}
                        alt="Post image"
                        className="w-full h-auto max-h-[400px] object-cover"
                        onError={(e) => {
                          // console.error("Image failed to load:", post.image);
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex-col pt-0">
                  {/* Stats */}
                  <div className="flex justify-between items-center w-full text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-gray-500" />
                        <span>{post.reactionCount || 0} likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.commentCount || 0} comments</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex border-t border-b w-full">
                    <Button
                      variant="ghost"
                      className="flex-1 py-3 rounded-none hover:bg-gray-50"
                      onClick={() => handleLike(post.id)}
                      disabled={reactionMutation.isPending}
                    >
                      <Heart
                        className={`h-5 w-5 mr-2 ${
                          reactionMutation.isPending
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      />
                      <span className="font-medium">Like</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="flex-1 py-3 rounded-none hover:bg-gray-50"
                      onClick={() =>
                        setActiveCommentPostId(
                          activeCommentPostId === post.id ? null : post.id
                        )
                      }
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Comment</span>
                    </Button>
                  </div>

                  {/* Comment Input */}
                  {activeCommentPostId === post.id && (
                    <div className="w-full mt-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            placeholder="Write a comment..."
                            value={commentInputs[post.id] || ""}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleComment(post.id);
                              }
                            }}
                            className="flex-1"
                            disabled={commentMutation.isPending}
                          />
                          <Button
                            size="icon"
                            onClick={() => handleComment(post.id)}
                            disabled={
                              commentMutation.isPending ||
                              !commentInputs[post.id]?.trim()
                            }
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-6 pb-6">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingPosts}
                  variant="outline"
                  className="w-full"
                >
                  {isLoadingPosts ? "Loading..." : "Load More Posts"}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default HomeFeedView;
