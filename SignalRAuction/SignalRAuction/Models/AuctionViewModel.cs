using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignalRAuction.Models
{
    public class AuctionViewModel
    {
        public double ProductPrice { get; set; }
        public int TimeRemaining
        {
            get
            {
                return (int)Math.Abs(GetTimeRemaining().TotalSeconds);
            }
        }

        public string TypeTime { get; set; }
        public int IncrementAmountPerBid { get; set; }
        public double BidPrice { get; set; }
        public int BidsTotal { get; set; }
        public DateTime LastBid { get; set; }
        public DateTime EndTime { get; set; }

        public decimal ValueLastBid { get; set; }
        public decimal ValueNextBid { get { return ValueLastBid + (decimal)0.01; } }
        public string LastUserBid { get; set; }

        public string EndTimeFullText
        {
            get { return string.Format("{0:MM/dd/yyyy HH\\:mm\\:ss}", EndTime); }
        }

        public AuctionViewModel() { }

        public AuctionViewModel(int bidsTotal, int incrementAmountPerBid, DateTime endTime, decimal valueInitialBid)
        {
            BidsTotal = bidsTotal;
            IncrementAmountPerBid = incrementAmountPerBid;
            LastBid = DateTime.Now;
            EndTime = endTime;
            ValueLastBid = valueInitialBid;
        }

        public TimeSpan GetTimeElapsed()
        {
            return DateTime.Now.Subtract(LastBid);
        }

        public TimeSpan GetTimeRemaining()
        {
            return DateTime.Now.Subtract(EndTime);
        }

        public void SetEndTime()
        {
            EndTime = LastBid.Add(GetTimeElapsed().Add(TimeSpan.FromSeconds(IncrementAmountPerBid)));
        }

        public void PlaceBid(decimal valueLastBid, string lastUserBid)
        {
            ValueLastBid = valueLastBid;
            LastUserBid = lastUserBid;
            BidsTotal++;
            LastBid = DateTime.Now;
            SetEndTime();
        }
    }
}