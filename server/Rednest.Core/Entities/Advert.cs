namespace Rednest.Core.Entities;

public class AdvertLogs
{
    public Guid? CreateUserId { get; set; }
    public DateTime CreateDate { get; set; } = DateTime.UtcNow.AddHours(4);
    public Guid? UpdateUserId { get; set; }
    public DateTime? UpdateDate { get; set; }
    public string? Note { get; set; }
}

public class Advert
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }
    public string? Link { get; set; }
    public AdvertLogs Logs { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public List<Guid> Likes { get; set; } = new();

    [System.Text.Json.Serialization.JsonIgnore]
    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string Descrition
    {
        get => Description;
        set => Description = value;
    }
}
