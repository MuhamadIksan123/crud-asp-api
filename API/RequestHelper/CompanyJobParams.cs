using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.RequestHelper
{
    public class CompanyJobParams : PaginationParams
    {
        public string? SearchTerm { get; set; }
    }
}