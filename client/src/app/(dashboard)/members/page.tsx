"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileUp,
  MoreVertical,
  Pencil,
  RotateCwIcon,
  Search,
  Trash,
  Trash2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PaginationBar } from "@/components/PaginationBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberDataType } from "@/app/(api)/createMember";
import EditMemberCard from "@/components/EditMemberCard";
import DeleteMember from "@/components/DeleteMember";
import RenewMembership, {
  MembershipRenewProps,
} from "@/components/RenewMember";
interface deleteProps {
  id: string;
  name: string;
}

export default function Member() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberDataType | null>(
    null,
  );
  const [renewOpen, setRenewOpen] = useState(false);
  const [renewMember, setRenewMember] = useState<MembershipRenewProps | null>(
    null,
  );
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [name, setName] = useState("");

  const filterRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const toggleAll = () => {
    if (allSelected) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(invoices.map((member) => member.phone));
    }
    setAllSelected(!allSelected);
  };

  const toggleMember = (phone: string) => {
    if (selectedMembers.includes(phone)) {
      setSelectedMembers(selectedMembers.filter((p) => p !== phone));
    } else {
      setSelectedMembers([...selectedMembers, phone]);
    }
  };

  const filters = ["all", "active", "inactive", "banned"];

  useEffect(() => {
    const activeEl = filterRefs.current[activeFilter];
    if (activeEl) {
      setUnderlineStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [activeFilter]);

  const invoices = [
    {
      _id: "648f1a1a1a1a1a1a1a1a011",
      fullName: "Bekele Teshome",
      phone: "0912345688",
      gender: "male",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: false,
      payments: [
        { amount: 300, date: "2025-05-01T00:00:00.000Z", method: "transfer" },
      ],
      membership: {
        startDate: "2025-05-01T00:00:00.000Z",
        endDate: "2025-07-31T00:00:00.000Z",
        durationMonths: 3,
        status: "expired",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a012",
      fullName: "Selamawit Tsegaye",
      phone: "0912345689",
      gender: "female",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: true,
      payments: [
        { amount: 450, date: "2025-06-05T00:00:00.000Z", method: "cash" },
      ],
      membership: {
        startDate: "2025-06-01T00:00:00.000Z",
        endDate: "2025-08-31T00:00:00.000Z",
        durationMonths: 3,
        status: "active",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a013",
      fullName: "Kebede Alemayehu",
      phone: "0912345690",
      gender: "male",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: true,
      payments: [
        { amount: 1200, date: "2025-01-05T00:00:00.000Z", method: "cbe" },
      ],
      membership: {
        startDate: "2025-01-01T00:00:00.000Z",
        endDate: "2025-12-31T00:00:00.000Z",
        durationMonths: 12,
        status: "active",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a014",
      fullName: "Almaz Hailu",
      phone: "0912345691",
      gender: "female",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: false,
      payments: [
        { amount: 600, date: "2025-02-10T00:00:00.000Z", method: "tele-birr" },
      ],
      membership: {
        startDate: "2025-02-01T00:00:00.000Z",
        endDate: "2025-07-31T00:00:00.000Z",
        durationMonths: 6,
        status: "expired",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a015",
      fullName: "Mekdes Wondimu",
      phone: "0912345692",
      gender: "female",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: true,
      payments: [
        { amount: 900, date: "2025-03-15T00:00:00.000Z", method: "transfer" },
      ],
      membership: {
        startDate: "2025-03-01T00:00:00.000Z",
        endDate: "2025-08-31T00:00:00.000Z",
        durationMonths: 6,
        status: "active",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a016",
      fullName: "Hailemariam Girma",
      phone: "0912345693",
      gender: "male",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: true,
      payments: [
        { amount: 1200, date: "2025-01-20T00:00:00.000Z", method: "cash" },
      ],
      membership: {
        startDate: "2025-01-01T00:00:00.000Z",
        endDate: "2025-12-31T00:00:00.000Z",
        durationMonths: 12,
        status: "active",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a017",
      fullName: "Betelhem Asfaw",
      phone: "0912345694",
      gender: "female",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: false,
      payments: [
        { amount: 300, date: "2025-04-01T00:00:00.000Z", method: "cbe" },
      ],
      membership: {
        startDate: "2025-04-01T00:00:00.000Z",
        endDate: "2025-06-30T00:00:00.000Z",
        durationMonths: 3,
        status: "expired",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a018",
      fullName: "Abebech Fikadu",
      phone: "0912345695",
      gender: "female",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: true,
      payments: [
        { amount: 750, date: "2025-02-20T00:00:00.000Z", method: "cash" },
      ],
      membership: {
        startDate: "2025-02-01T00:00:00.000Z",
        endDate: "2025-07-31T00:00:00.000Z",
        durationMonths: 6,
        status: "active",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a019",
      fullName: "Tigist Alemu",
      phone: "0912345696",
      gender: "female",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: false,
      payments: [
        { amount: 400, date: "2025-01-10T00:00:00.000Z", method: "cbe" },
      ],
      membership: {
        startDate: "2025-01-01T00:00:00.000Z",
        endDate: "2025-03-31T00:00:00.000Z",
        durationMonths: 3,
        status: "expired",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a020",
      fullName: "Yonas Tadesse",
      phone: "0912345697",
      gender: "male",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: true,
      payments: [
        { amount: 1100, date: "2025-03-05T00:00:00.000Z", method: "transfer" },
      ],
      membership: {
        startDate: "2025-03-01T00:00:00.000Z",
        endDate: "2025-12-31T00:00:00.000Z",
        durationMonths: 10,
        status: "active",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a021",
      fullName: "Helen Tsegaye",
      phone: "0912345698",
      gender: "female",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: true,
      payments: [
        { amount: 500, date: "2025-04-15T00:00:00.000Z", method: "cash" },
      ],
      membership: {
        startDate: "2025-04-01T00:00:00.000Z",
        endDate: "2025-06-30T00:00:00.000Z",
        durationMonths: 3,
        status: "active",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a022",
      fullName: "Dawit Bekele",
      phone: "0912345699",
      gender: "male",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: false,
      payments: [
        { amount: 350, date: "2025-02-01T00:00:00.000Z", method: "cbe" },
      ],
      membership: {
        startDate: "2025-02-01T00:00:00.000Z",
        endDate: "2025-04-30T00:00:00.000Z",
        durationMonths: 3,
        status: "expired",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a023",
      fullName: "Selamawit Desta",
      phone: "0912345700",
      gender: "female",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: true,
      payments: [
        { amount: 600, date: "2025-03-20T00:00:00.000Z", method: "transfer" },
      ],
      membership: {
        startDate: "2025-03-01T00:00:00.000Z",
        endDate: "2025-08-31T00:00:00.000Z",
        durationMonths: 6,
        status: "active",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a024",
      fullName: "Abel Tadesse",
      phone: "0912345701",
      gender: "male",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: true,
      payments: [
        { amount: 1000, date: "2025-05-01T00:00:00.000Z", method: "cash" },
      ],
      membership: {
        startDate: "2025-05-01T00:00:00.000Z",
        endDate: "2025-10-31T00:00:00.000Z",
        durationMonths: 6,
        status: "active",
      },
    },
    {
      _id: "648f1a1a1a1a1a1a1a1a025",
      fullName: "Mebratu Mekonnen",
      phone: "0912345702",
      gender: "male",
      role: "member",
      avatar: "/gym/profile.png",
      isActive: false,
      payments: [
        { amount: 450, date: "2025-01-05T00:00:00.000Z", method: "cbe" },
      ],
      membership: {
        startDate: "2025-01-01T00:00:00.000Z",
        endDate: "2025-06-30T00:00:00.000Z",
        durationMonths: 6,
        status: "expired",
      },
    },
  ];

  function handleEditAction(member: (typeof invoices)[0]) {
    const data: MemberDataType = {
      fullName: member.fullName,
      phone: member.phone,
      gender: member.gender,
      avatar: member.avatar,
      payments: member.payments.map((p) => ({
        amount: p.amount,
        date: new Date(p.date),

        method: p.method as "cash" | "cbe" | "tele-birr" | "transfer",
      })),
      durationMonths: member.membership?.durationMonths.toString(),
    };

    setSelectedMember(data);
    setEditOpen(true);
  }

  function handleRenewMember(member: (typeof invoices)[0]) {
    const data = {
      id: member._id,
      fullName: member.fullName,
      avatar: member.avatar,
      phone: member.phone,
      status: member.membership?.status === "active" ? "Active" : "Expired",
      membershipPeriod: member.membership?.durationMonths.toString() || "0",
    };

    setRenewMember(data);
    setRenewOpen(true);
  }

  function handleDeleteClick({ id, name }: deleteProps) {
    setName(name);
    setDeleteId(id); // only store ID/phone
    setDeleteOpen(true);
  }

  function handleConfirmDelete(id: string) {
    console.log("Deleting member with ID:", id);
    setDeleteOpen(false);
    setDeleteId("");
  }

  return (
    <div className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-5 py-6">
        <div className="flex w-full flex-col items-center justify-center gap-5 md:justify-between lg:flex-row">
          <div>
            <h1 className="text-2xl font-bold">Manage Members</h1>
            <p className="text-muted-foreground">
              View and manage all gym members.
            </p>
          </div>
        </div>

        <div className="relative mt-6 flex gap-6 border-b border-gray-700 pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              ref={(el) => {
                filterRefs.current[filter] = el;
              }}
              onClick={() => setActiveFilter(filter)}
              className={`pb-1 font-medium transition-colors ${
                activeFilter === filter
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}

          <span
            className="bg-primary absolute bottom-0 h-0.5 transition-all duration-300"
            style={{ left: underlineStyle.left, width: underlineStyle.width }}
          />
        </div>

        <div className="lg: mt-3 flex flex-col items-center justify-between gap-4 md:items-start xl:flex-row">
          <div className="border-muted-foreground focus-within:border-primary flex items-center gap-2 rounded-none border px-3 transition-colors">
            <Search />
            <input
              placeholder="Search for member"
              className="border-none px-6 py-2 outline-none active:border-none"
            />
          </div>
          <div className="flex flex-col items-center gap-3 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="text-white">
                3 <span>member selected</span>
              </div>
              <Button variant="destructive" className="rounded-none">
                <Trash />
                <span>Delete</span>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Select>
                <SelectTrigger className="w-[180px] rounded-none bg-[#1C1F26] text-white">
                  <SelectValue placeholder="Export for..." />
                </SelectTrigger>
                <SelectContent className="rounded-none bg-[#1C1F26] text-white">
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="365">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Button className="flex items-center gap-2 rounded-none">
                <FileUp className="h-4 w-4" /> Export Members
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead className="text-white">Member</TableHead>
                <TableHead className="text-white">Phone</TableHead>
                <TableHead className="text-white">Gender</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Membership</TableHead>
                <TableHead className="text-white">Amount (ETB)</TableHead>
                <TableHead className="text-white">Payment Method</TableHead>
                <TableHead className="text-right text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((member) => {
                const latestPayment =
                  member.payments[member.payments.length - 1];
                return (
                  <TableRow key={member.phone}>
                    <TableCell>
                      <Checkbox
                        checked={selectedMembers.includes(member.phone)}
                        onCheckedChange={() => toggleMember(member.phone)}
                      />
                    </TableCell>
                    <TableCell className="flex items-center gap-2 font-medium">
                      <Image
                        height={32}
                        width={32}
                        src={member.avatar || "/gym/profile.png"}
                        alt={member.fullName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      {member.fullName}
                    </TableCell>

                    <TableCell>{member.phone}</TableCell>

                    <TableCell className="capitalize">
                      {member.gender}
                    </TableCell>

                    <TableCell>
                      {member.isActive ? (
                        <span className="text-green-500">Active</span>
                      ) : (
                        <span className="text-red-500">Inactive</span>
                      )}
                    </TableCell>

                    <TableCell className="capitalize">
                      {member.membership?.status || "-"}
                    </TableCell>

                    <TableCell className="text-right">
                      {latestPayment?.amount != null
                        ? `${latestPayment.amount.toFixed(2)} ETB`
                        : "-"}
                    </TableCell>

                    <TableCell className="text-end uppercase">
                      {latestPayment?.method || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-gray-800"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-5 w-5 text-gray-300" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-40 rounded-none border border-gray-700 bg-[#1C1F26] text-white"
                          onClick={(e) => e.stopPropagation()} // prevent triggering row click
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="cursor-pointer text-blue-400 hover:bg-blue-500/10"
                            onClick={() => handleEditAction(member)}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer text-green-400 hover:bg-green-500/10"
                            onClick={() => handleRenewMember(member)}
                          >
                            <RotateCwIcon className="mr-2 h-4 w-4" /> Renew
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer text-red-400 hover:bg-red-500/10"
                            onClick={() =>
                              handleDeleteClick({
                                id: member._id,
                                name: member.fullName,
                              })
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-gray-700">
                <TableCell colSpan={8} className="text-xl font-bold">
                  Total
                </TableCell>
                <TableCell className="py-4 text-right text-xl font-bold">
                  34567 <span className="py-4 text-green-500">ETB</span>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <div>
            <PaginationBar currentPage={5} totalPage={12} />
          </div>
        </div>
      </div>
      <EditMemberCard
        open={editOpen}
        selectedMember={selectedMember}
        onOpenChange={() => setEditOpen(false)}
      />
      <DeleteMember
        open={deleteOpen}
        onDelete={() => handleConfirmDelete(deleteId)}
        onOpenChange={setDeleteOpen}
        id={deleteId}
        name={name}
      />
      <RenewMembership
        open={renewOpen}
        onOpenChange={setRenewOpen}
        member={renewMember}
      />
    </div>
  );
}
