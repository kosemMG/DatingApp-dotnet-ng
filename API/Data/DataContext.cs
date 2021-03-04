using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
  public class DataContext : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>, AppUserRole,
    IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
  {
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Connection> Connections { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      modelBuilder.Entity<AppUser>()
        .HasMany(user => user.UserRoles)
        .WithOne(userRole => userRole.User)
        .HasForeignKey(userRole => userRole.UserId)
        .IsRequired();

      modelBuilder.Entity<AppRole>()
        .HasMany(role => role.UserRoles)
        .WithOne(userRole => userRole.Role)
        .HasForeignKey(userRole => userRole.RoleId)
        .IsRequired();

      modelBuilder.Entity<UserLike>()
        .HasKey(like => new {like.SourceUserId, like.LikedUserId});

      modelBuilder.Entity<UserLike>()
        .HasOne(like => like.SourceUser)
        .WithMany(like => like.LikedUsers)
        .HasForeignKey(like => like.SourceUserId)
        .OnDelete(DeleteBehavior.Cascade);

      modelBuilder.Entity<UserLike>()
        .HasOne(like => like.LikedUser)
        .WithMany(like => like.LikedByUsers)
        .HasForeignKey(like => like.LikedUserId)
        .OnDelete(DeleteBehavior.Cascade);

      modelBuilder.Entity<Message>()
        .HasOne(message => message.Recipient)
        .WithMany(user => user.MessagesReceived)
        .OnDelete(DeleteBehavior.Restrict);

      modelBuilder.Entity<Message>()
        .HasOne(message => message.Sender)
        .WithMany(user => user.MessagesSent)
        .OnDelete(DeleteBehavior.Restrict);
    }
  }
}