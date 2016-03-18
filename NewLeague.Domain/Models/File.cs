using System.ComponentModel.DataAnnotations;

namespace NewLeague.Models
{
    public class File
    {

            public int Id { get; set; }
            [StringLength(255)]
            public string FileName { get; set; }
            public string Description { get; set; }
            [StringLength(100)]
            public string ContentType { get; set; }
            public byte[] Content { get; set; }
    }
}
