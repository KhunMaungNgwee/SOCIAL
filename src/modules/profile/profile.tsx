import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Mail,
  CalendarDays,
} from "lucide-react";
import { toast } from "../../components/ui/use-toast";
import { Button } from "../../components/ui/button";
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
  useCommentMutation,
  useReactionMutation,
} from "../../api/newfeed";
import { useProfileQuery } from "../../api/profile";
import { useMyPostsQuery } from "../../api/post";
import { Skeleton } from "../../components/ui/skeleton";

const ProfileView = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(
    null
  );
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>(
    {}
  );


  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isError: isProfileError,
  } = useProfileQuery();

  const {
    data: postsData,
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = useMyPostsQuery(page, pageSize);

  // Comment mutation
  const commentMutation = useCommentMutation({
    onSuccess: (response, variables) => {
      setCommentInputs((prev) => ({ ...prev, [variables.postId]: "" }));
      setActiveCommentPostId(null);

      toast({
        description: "Comment added successfully",
        variant: "success",
      });

      // Refresh posts to show new comment count
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

  const profile = profileData?.data;
  const posts = postsData?.data || [];
  const hasMore = posts.length >= pageSize;

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getPostAuthorName = (post : any) => {
    return post.user?.name || profile?.name || "User";
  };

  // Show loading state
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 py-6">
          {/* Profile Header Skeleton */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-8 w-12 mx-auto" />
                    <Skeleton className="h-4 w-20 mx-auto mt-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Posts Skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (isProfileError || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Failed to load profile
          </h2>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  const username = profile.name.toLowerCase().replace(/\s+/g, "_");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Profile</h1>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow">
                <AvatarImage src="" alt={profile.name} />
                <AvatarFallback className="text-lg bg-blue-600 text-white">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profile.name}
                  </h2>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    @{username}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    {profile.email}
                  </div>
                  {profile.createdAt && (
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Joined{" "}
                      {formatDistanceToNow(new Date(profile.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {profile.postCount}
                </div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {profile.reactionCount}
                </div>
                <div className="text-sm text-gray-500">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {profile.commentCount}
                </div>
                <div className="text-sm text-gray-500">Comments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Posts Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Your Posts</h3>
        </div>

        {/* Posts Feed */}
        {isLoadingPosts && page === 1 ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card className="text-center py-10">
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-700">
                No posts yet
              </h3>
              <p className="text-gray-500 mt-1">
                Start sharing your thoughts with the community!
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Posts List */}
            {posts.map((post) => {
              const authorName = getPostAuthorName(post);
              return (
                <Card key={post.id} className="mb-4">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" alt={authorName} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {getInitials(authorName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {authorName}
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
                    {post.title && (
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
                            console.error("Image failed to load:", post.image);
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
                          <span>{post.reactions?.length || 0} likes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments?.length  || 0} comments</span>
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
                            <AvatarFallback>
                              {getInitials(profile.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 flex gap-2">
                            <textarea
                              placeholder="Write a comment..."
                              value={commentInputs[post.id] || ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [post.id]: e.target.value,
                                }))
                              }
                              className="flex-1 border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                              disabled={commentMutation.isPending}
                            />
                            <Button
                              size="icon"
                              onClick={() => handleComment(post.id)}
                              disabled={
                                commentMutation.isPending ||
                                !commentInputs[post.id]?.trim()
                              }
                              className="bg-blue-600 hover:bg-blue-700 h-10 w-10"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-6 mb-6">
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

export default ProfileView;